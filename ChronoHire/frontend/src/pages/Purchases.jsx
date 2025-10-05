import { isJwtExpired } from '@/utils/utilities';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from '@/components/Loading';



const plans = [
  {
    name: 'Basic Plan',
    credits: 100,
    price: 5,
    description: 'Perfect for a quick interview practice.',
  },
  {
    name: 'Standard Plan',
    credits: 200,
    price: 10,
    description: 'Ideal for moderate interview preparation.',
  },
  {
    name: 'Premium Plan',
    credits: 500,
    price: 20,
    description: 'For extensive and advanced practice.',
  },
];


function Purchases() {
  const authorization = useSelector((state) => state.user.authorization);
  const navigate = useNavigate()
  const [buying, setBuying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [selectedPrice, setSelectedPrice] = useState(null)


  const loadOrders = () => {
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/get-orders`,
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    };
    setLoading(true);
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authorization) {
      navigate('/login');
      return;
    }

    if (isJwtExpired(authorization)) {
      navigate('/login');
      return;
    }

    loadOrders()
  }, [authorization, navigate]);


  const handlePurchase = (plan) => {
    const options = {
      method: 'POST',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-checkout-session`,
      headers: {
        Authorization: `Bearer ${authorization}`
      },
      data: {
        product: {
          name: plan.name, price: plan.price
        }
      }
    };
    setBuying(true)
    setSelectedPrice(plan.price)
    axios.request(options).then(function (response) {
      console.log(response.data);
      window.location.href = response.data.checkout_url
    }).catch(function (error) {
      console.error(error);
    }).finally(() => {
      setBuying(false)
      setSelectedPrice(null)
    }
    );
  }


  return (
    <>
      <div className='purchases max-w-4xl mx-auto'>
        <h1 className='text-center text-2xl font-bold mt-6'>Purchases Coins</h1>
        <p className='text-center text-gray-600 text-lg'>Purchase coins to use on interviews</p>
        <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 p-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="w-full card h-full p-6 border border-gray-300 rounded-lg shadow-lg flex flex-col items-center space-y-4  transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-gray-400"
            >
              <h3 className="text-xl font-medium text-gray-800">{plan.title}</h3>
              <p className="text-blue-500 text-lg">Credits: {plan.credits}</p>
              <p className="text-2xl font-semibold text-orange-500">${plan.price}</p>
              <p className="text-gray-600 text-center">{plan.description}</p>
              <button
                onClick={() => handlePurchase(plan)}
                className={` ${(buying && plan.price == selectedPrice) ? 'bg-blue-400 hover:bg-blue-400' : 'bg-blue-700 hover:bg-blue-700'} text-white py-2 px-6 rounded-md  transition duration-200 cursor-pointer flex justify-center items-center gap-2`}>
                {(buying && plan.price == selectedPrice) ? <FaSpinner className="animate-spin" /> : ''}
                <p>{(buying && plan.price == selectedPrice) ? 'Buying..' : 'Choose Plan'}</p>
              </button>
            </div>
          ))}

        </div>



      </div>
      <div className="purchase-history max-w-5xl mx-auto p-6">
        <h1 className='text-start text-2xl font-bold mt-6 mb-3'>Purchase history</h1>
        {loading ?
          <Loading />
          :
          <Table className="w-full border border-black">
            <TableHeader>
              <TableRow className="border border-black">
                <TableHead className="w-[100px] border border-black">Product</TableHead>
                <TableHead className="text-right border border-black">Payment ID</TableHead>
                <TableHead className="border border-black">Price</TableHead>
                <TableHead className="border border-black">Coins</TableHead>
                <TableHead className="border border-black">Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} className="border border-black">
                  <TableCell className="font-medium border border-black">
                    {order.productName}
                  </TableCell>

                  <TableCell className="text-right border border-black">{order.checkoutId}</TableCell>
                  <TableCell className="text-right border border-black">${order.price}</TableCell>
                  <TableCell className="text-right border border-black">{order.coins}</TableCell>
                  <TableCell className="text-right border border-black">{new Date(order.createdAt).toLocaleString(
                    'en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true
                  })}</TableCell>
                </TableRow>
              ))}
            </TableBody>


          </Table>
        }

      </div>
    </>

  )
}

export default Purchases