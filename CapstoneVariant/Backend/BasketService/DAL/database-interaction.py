import redis, json, uuid

from models.apimodels import Basket, Item

rConnPool = redis.ConnectionPool(host='CloverpatchBasketDatabase', port=10002)


def check_BasketExists(BID: str):
    try:
        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database
        BASKET_EXISTS = rConn.exists(BID)

        return (BASKET_EXISTS == 1)
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def addItemToBasket(BID: str, item: Item):
    try:
        rConn = redis.Redis(connection_pool=rConnPool) # Connect to Redis Database
        
        # Replace '-' with '_' in the BID; Redis doesn't like the '-' character
        BID = BID.__str__().replace('-', '_')
        rConn.rpush(f'{BID}:Items', item.json())
        return {
            'success' : True,
            'message' : f'Item added to Basket {BID} Successfully',
            'basketId': BID
        }
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


