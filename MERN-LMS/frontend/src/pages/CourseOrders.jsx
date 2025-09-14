import { isJwtExpired } from '@/utils/utilities';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
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

function CourseOrders() {
  const authorization = useSelector((state) => state.user.authorization);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = () => {
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/course/course-orders`,
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
      console.warn('Token expired');
      navigate('/login');
      return;
    }

    loadOrders();
  }, [authorization, navigate]);

  if (loading) {
    return (
      <div className="wrapper min-h-[80vh] w-full flex justify-center items-center">
        <FaSpinner size={40} className="animate-spin" />
      </div>
    );
  }

  const totalPrice = orders.reduce(
    (sum, order) => sum + (Number(order.metadata.price)),
    0
  );

  return (
    <div className="min-h-[80vh] w-full p-6">
      <h1 className="text-md font-bold mb-4">List of your course purchases.</h1>

      <Table className="w-full border border-black">
        <TableHeader>
          <TableRow className="border border-black">
            <TableHead className="w-[100px] border border-black">Course Title</TableHead>
            <TableHead className="border border-black">Student Name</TableHead>
            <TableHead className="border border-black">Student Email</TableHead>
            <TableHead className="text-right border border-black">Payment ID</TableHead>
            <TableHead className="border border-black">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} className="border border-black">
              <TableCell className="font-medium border border-black">
                {order.metadata.courseTitle}
              </TableCell>
              <TableCell className="border border-black">{order.metadata.studentName}</TableCell>
              <TableCell className="border border-black">{order.metadata.userEmail}</TableCell>
              <TableCell className="text-right border border-black">{order.checkoutId}</TableCell>
              <TableCell className="border border-black">
                {Number(order.metadata.price).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="border border-black">
            <TableCell colSpan={4} className="font-bold border border-black">
              Total
            </TableCell>
            <TableCell className="font-bold border border-black border-l-0">
              {totalPrice.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default CourseOrders;
