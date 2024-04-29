const testData = async () => {
  const payload = await fetch(
    "https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=YDfBNhrA06arKawmBGoNInbOs6J8VgXX"
  );
  payload.json().then((data) => console.log(data));
};

testData();
