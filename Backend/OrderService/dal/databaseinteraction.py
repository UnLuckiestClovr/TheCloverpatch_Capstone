import redis, json, uuid, re, traceback, pymongo

from datetime import datetime
from models.apimodels import Order, FoodOrder,  AddressInfo, Item
from miscscripts.SendEmail import sendEmail

rConnPool = redis.ConnectionPool(host='CloverpatchBasketDatabase', port=6379)

MongoClient = pymongo.MongoClient("mongodb://CloverpatchProductDatabase:27017/") # Test Connection, Change to Containerized Connection string upon Deployment
orderDatabase = MongoClient["CloverpatchOrders"]
flowerOrderCollection = orderDatabase["FlowerOrders"]
foodOrderCollection = orderDatabase["FoodOrders"]


def processFlowerList(OID: str, BID: str, address: AddressInfo, json_list: list, current_time):

    items = []
    totalcost = 0.00
    for json_str in json_list:
        item_dict = json.loads(json_str.decode('utf-8'))
        item = Item(**item_dict)
        items.append(item)
        totalcost = totalcost + item.Price

    order = Order(
            OID=OID,
            UID=f'{BID}',
            Items=items,
            FinalPrice=totalcost,
            AddressInfo=address,
            TimeMade=current_time
        )
    
    return order


def processFoodList(OID: str, BID: str, json_list: list, current_time):

    items = []
    totalcost = 0.00
    for json_str in json_list:
        item_dict = json.loads(json_str.decode('utf-8'))
        item = Item(**item_dict)
        items.append(item)
        totalcost = totalcost + item.Price

    order = FoodOrder(
            OID=OID,
            UID=f'{BID}',
            Items=items,
            FinalPrice=totalcost,
            TimeMade=current_time
        )
    
    return order


def ProcessBasketToOrder(orderAddress: AddressInfo, BID: str, Email: str):
    try:
        redisBID = f"{BID.__str__().replace('-', '_')}"  # Concatenate for Redis

        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database

        # Get all elements from the list
        flowerStrings = rConn.lrange(f'{redisBID}:Flowers', 0, rConn.llen(f'{redisBID}:Flowers'))
        foodStrings = rConn.lrange(f'{redisBID}:Food', 0, rConn.llen(f'{redisBID}:Food'))

        current_time = datetime.now().strftime("%m/%d/%Y - %H:%M")

        # Process Lists into Order Objects
        if (flowerStrings.__len__() > 0):
            OID = (uuid.uuid4()).__str__()
            flowerOrder = processFlowerList(OID, BID, orderAddress, flowerStrings, current_time)
            flowerOrderCollection.insert_one(json.loads(flowerOrder.json()))
        if (foodStrings.__len__() > 0):
            OID = (uuid.uuid4()).__str__()
            foodOrder = processFoodList(OID, BID, foodStrings, current_time)
            foodOrderCollection.insert_one(json.loads(foodOrder.json()))

        sendEmail(
            "Cafe Order Made at The Cloverpatch!", 
            f"Your orders were accepted at {current_time} and will be processed soon, you will recieve an email or text!", 
            Email
        )

        return {
            'success': True,
            'message': f'Orders created Successfully'
        }
            
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def FetchFlowerOrderbyID(OID: str):
    try:
        document = flowerOrderCollection.find_one({"OID":OID})

        if (document != None):
            return {
                'success': True,
                'message': f'Order {OID} fetched Successfully',
                'order': json.dumps(document, default=str)
            }
        else:
            return {
                'success': False,
                'message': f'Fetching of Order {OID} Unsuccessful!'
            }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def FetchFoodOrderbyID(OID: str):
    try:
        document = foodOrderCollection.find_one({"OID":OID})

        if (document != None):
            return {
                'success': True,
                'message': f'Order {OID} fetched Successfully',
                'order': json.dumps(document, default=str)
            }
        else:
            return {
                'success': False,
                'message': f'Fetching of Order {OID} Unsuccessful!'
            }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def FetchFlowerOrdersOfUser(UID: str):
    try:
        documents = flowerOrderCollection.find({"UID": UID})

        orders = [{key: value for key, value in document.items()} for document in documents]

        return {
            'success': True,
            'message': f'Orders for User {UID} fetched Successfully',
            'orders': json.dumps(orders, default=str)
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def FetchFoodOrdersOfUser(UID: str):
    try:
        documents = foodOrderCollection.find({"UID": UID})

        orders = [{key: value for key, value in document.items()} for document in documents]

        return {
            'success': True,
            'message': f'Orders for User {UID} fetched Successfully',
            'orders': json.dumps(orders, default=str)
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def CancelFlowerOrder(OID: str):
    try:
        flowerOrderCollection.delete_one({"OID": OID})

        return {
            "success" : True,
            "message" : f"Successful Deletion of Order {OID}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }


def CompleteFoodOrder(OID: str):
    try:
        foodOrderCollection.delete_one({"OID": OID})

        return {
            "success" : True,
            "message" : f"Successful Deletion of Order {OID}"
        }
    except Exception as e:
        traceback.print_exception(e)
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }