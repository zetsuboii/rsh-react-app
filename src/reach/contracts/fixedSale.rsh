'reach 0.1';

// Platform
// One user -> Participant

// User -> Seller / Buyer
// Multiple user => API (ParticipantClass)

// View -> Read only fonksiyonlar
// Remote -> Başka kontratlarla etkileşme

const [isSaleStatus, FOR_SALE, NOT_FOR_SALE] = makeEnum(2);

const NftDetails = Object({
  tokenId: Token,
  initialPrice: UInt,
  platformCommission: UInt,
  platformAddress: Address
});

const Random = Struct([["x", UInt], ["y", Bytes(8)]]);

const OwnerInterface = {
  getNftDetails: Fun([Random, UInt], NftDetails)
};

const UserApiInterface = {
  // Satışa çıkar
  changePrice: Fun([UInt], Null),
  // Satın al
  // buy: Fun([], Null),
  // Teklif ver
  makeOffer: Fun([UInt], Null),
  testAPI: Fun([], UInt)
  // revokeOffer: Fun([], Null),
  // Teklif kabul et
  // acceptOffer: Fun([Address], Null)
}

const UserViews = {
  // Ücret
  price: UInt,
  // Sahip
  owner: Address,
  // Teklif göster
  getOfferOf: Fun([Address], Maybe(UInt))
}

export const main = Reach.App(() => {
  const Owner = Participant('Owner', OwnerInterface);
  const User_API = API('UserA', UserApiInterface);
  const User_View = View('UserV', UserViews);
  // const User_Event = Events('UserE', UserEvents);
  init();

  Owner.only(() => {
    const { tokenId, initialPrice } = declassify(interact.getNftDetails(
      Random.fromTuple([12, Bytes(8).pad("ayo")]), 5));
  });
  Owner.publish(tokenId, initialPrice);
  commit();

  Owner.pay([[1, tokenId]]);

  const offers = new Map(Address, UInt);

  const initialState = {
    owner: Owner,
    price: initialPrice,
    status: FOR_SALE,
    totalOfferAmt: 0
  }

  const { owner, price, status, totalOfferAmt } =
    parallelReduce(initialState)
      .invariant(
        balance() == totalOfferAmt &&
        balance(tokenId) == (status == FOR_SALE ? 1 : 0)
      )
      .define(() => {
        User_View.price.set(price);
        User_View.owner.set(owner);
        User_View.getOfferOf.set((address) => offers[address]);
      })
      .while(status == FOR_SALE || totalOfferAmt != 0)
      .api(
        User_API.changePrice, // Function signature
        ((_) => {
          check(status == FOR_SALE, "Asset not for sale");
          check(this == owner, "Not owner of asset");
        }), // Assumptions
        ((_) => 0), // Payment
        ((newPrice, ok) => {
          check(status == FOR_SALE);
          check(this == owner);
          ok(null);

          return { owner, price: newPrice, status, totalOfferAmt };
        })  // Consensus
      )
      .api(
        User_API.makeOffer,
        ((_) => {
          check(status == FOR_SALE, "Asset not for sale");
          check(isNone(offers[this]), "Already have an offer");
          check(this != owner, "Owner of asset");
        }),
        ((offerPrice) => offerPrice),
        ((offerPrice, ok) => {
          check(status == FOR_SALE, "Asset not for sale");
          check(isNone(offers[this]), "Already have an offer");
          check(this != owner, "Owner of asset");
          ok(null);

          offers[this] = offerPrice;
          // Emit Event
          return { owner, price, status, totalOfferAmt: totalOfferAmt + offerPrice };
        })
      )
      .api(
        User_API.testAPI,
        (() => { }),
        (() => 0),
        ((ok) => {
          ok(5);
          return { owner, price, status, totalOfferAmt }
        })
      )
      .timeout(false);

  commit();
  // write your program here
  exit();
});
