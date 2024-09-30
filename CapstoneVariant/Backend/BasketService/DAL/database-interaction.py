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


# Retrieves the List of Items from the Basket
def getBasket(BID: str):
    try:
        rConn = redis.Redis(connection_pool=rConnPool)

        # Get all elements from the list
        json_strings = rConn.lrange(f'{BID}:Items', 0, rConn.llen(f'{BID}:Items'))

        items = []
        for json_str in json_strings:
            item_dict = json.loads(json_str.decode('utf-8'))
            item = Item(**item_dict)
            items.append(item)
        return {
            "success": True,
            "message": f'Successful Grab from Basket : {BID}',
            "value": items
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


def deleteItemFromBasket(BID: str, IID: str):
    try:
        rConn = redis.Redis(connection_pool=rConnPool)

        # Get all elements from the list
        items = rConn.lrange(f'{BID}:Items', 0, rConn.llen(f'{BID}:Items'))

        if items:
            # Decode to Python Dicts
            itemsDecoded = [item.decode('utf-8') for item in items]
            itemObjects = [json.loads(item) for item in itemsDecoded]
            print(itemObjects)

            #iterate through list to find then remove the item by checking item IID
            updatedItemObjects = [item for item in itemObjects if item.get('IID') != IID]

            print(updatedItemObjects)

            if len(itemObjects) != len(updatedItemObjects):
                #encode back into strings for redis to use
                updatedItems = [json.dumps(item) for item in updatedItemObjects]

                #update redis data
                rConn.delete(f'{BID}:Items')
                if updatedItems:
                    rConn.rpush(f'{BID}:Items', *updatedItems)

                    return {
                        "success": True,
                        "message": f"Basket \'{BID}\' updated successfully"
                    }
            return {
                "success": False,
                "message": f"Could not find Item of IID : {IID}"
            }
        else:
            return {
                "success" : False,
                "message" : f"Could not find Basket of UID : {BID}"
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


def ClearBasket(BID: str):
    try:
        rConn = redis.Redis(connection_pool=rConnPool)
        rConn.delete(f'{BID}:Items')
        return {
            "success" : True,
            "message" : f"Successful Deletion of Basket : {BID}"
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