import requests
import logging

logger = logging.getLogger(__name__)


def fetch_from_coingecko(symbol: str):
    logging.debug('fetch_from_coingecko')
    base_url = "https://api.coingecko.com/api/v3"
    all_coins = requests.get(f"{base_url}/coins/list").json()

    coin_id = None
    for coin in all_coins:
        if coin["symbol"] == symbol.lower():
            coin_id = coin["id"]
            break

    if not coin_id:
        return None

    markets = requests.get(
        f"{base_url}/coins/markets",
        params={"vs_currency": "usd", "ids": coin_id}
    ).json()

    if not markets:
        return None

    coin_data = markets[0]
    print('coin_data', coin_data)
    return {
        "symbol": coin_data["symbol"],
        "name": coin_data["name"],
        "current_price": coin_data["current_price"],
        "image_url": coin_data["image"]
    }
