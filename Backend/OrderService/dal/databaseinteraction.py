import redis, json, uuid, re, traceback, pymongo

from datetime import datetime
from models.apimodels import Order, AddressInfo, Item
from miscscripts.SendEmail import sendEmail

rConnPool = redis.ConnectionPool(host='CloverpatchBasketDatabase', port=6379)

MongoClient = pymongo.MongoClient("mongodb://CloverpatchProductDatabase:27017/") # Test Connection, Change to Containerized Connection string upon Deployment
orderDatabase = MongoClient["CloverpatchOrders"]
orderCollection = orderDatabase["Orders"]


def ProcessBasketToOrder(orderAddress: AddressInfo, BID: str, Email: str):
    try:
        OID = (uuid.uuid4()).__str__()
        redisBID = f"Basket_{BID.__str__().replace('-', '_')}"  # Concatenate for Redis

        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database

        # Get all elements from the list
        json_strings = rConn.lrange(f'{redisBID}:Items', 0, rConn.llen(f'{redisBID}:Items'))

        items = []
        totalcost = 0.00
        for json_str in json_strings:
            item_dict = json.loads(json_str.decode('utf-8'))
            item = Item(**item_dict)
            items.append(item)
            totalcost = totalcost + item.Price

        current_time = datetime.now().strftime("%m/%d/%Y - %H:%M")

        order = Order(
            OID=OID,
            UID=f'{BID}',
            Items=items,
            FinalPrice=totalcost,
            AddressInfo=orderAddress,
            TimeMade=current_time
        )

        orderCollection.insert_one(json.loads(order.json()))

        sendEmail(
            "Cafe Order Made at The Cloverpatch!", 
            f"Your order was accepted at {current_time} and will be processed soon, you will recieve an email or text!", 
            Email
        )

        return {
            'success': True,
            'message': f'Order {OID} created Successfully',
            'orderID': f'{OID}'
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


def FetchOrderbyID(OID: str):
    try:
        document = orderCollection.find_one({"OID":OID})

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


def FetchOrdersOfUser(UID: str):
    try:
        documents = orderCollection.find({"UID": UID})

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


def CancelOrder(OID: str):
    try:
        orderCollection.delete_one({"OID": OID})

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