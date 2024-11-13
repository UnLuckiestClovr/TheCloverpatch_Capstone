import redis, json, uuid

from models.apimodels import Basket, Item

rConnPool = redis.ConnectionPool(host='CloverpatchBasketDatabase', port=6379)


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


def addItemToBasket(BID: str, item: Item):  # BID is Basket ID, this will be the User's ID as it reduces need for extra data storage and saves load time.
    try:
        BID = BID.__str__().replace('-', '_')
        redisBID = f"Basket_{BID}"

        rConn = redis.Redis(connection_pool=rConnPool) # Connect to Redis Database
        
        # Replace '-' with '_' in the BID; Redis doesn't like the '-' character
        rConn.rpush(f'{redisBID}:Items', item.json())
        return {
            'success' : True,
            'message' : f'Item added to {redisBID} Successfully',
            'basketId': f'{redisBID}'
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
        BID = BID.__str__().replace('-', '_')
        redisBID = f"Basket_{BID}"

        rConn = redis.Redis(connection_pool=rConnPool)

        # Get all elements from the list
        json_strings = rConn.lrange(f'{redisBID}:Items', 0, rConn.llen(f'{redisBID}:Items'))

        print(json_strings)

        items = []
        for json_str in json_strings:
            print(json_str)
            item_dict = json.loads(json_str.decode('utf-8'))
            item = Item(**item_dict)
            items.append(item)
        return {
            "success": True,
            "message": f'Successful Grab from {redisBID}',
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
        BID = BID.__str__().replace('-', '_')
        redisBID = f"Basket_{BID}"

        rConn = redis.Redis(connection_pool=rConnPool)

        # Get all elements from the list
        items = rConn.lrange(f'{BID}:Items', 0, rConn.llen(f'{redisBID}:Items'))

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
                rConn.delete(f'{redisBID}:Items')
                if updatedItems:
                    rConn.rpush(f'{redisBID}:Items', *updatedItems)

                    return {
                        "success": True,
                        "message": f"\'{redisBID}\' updated successfully"
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
        BID = BID.__str__().replace('-', '_')
        redisBID = f"Basket_{BID}"

        rConn = redis.Redis(connection_pool=rConnPool)
        rConn.delete(f'{redisBID}:Items')
        return {
            "success" : True,
            "message" : f"Successful Deletion of {redisBID}"
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