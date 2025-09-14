import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import CourseSection from '../components/CourseSection'
import Loading from '@/components/Loading'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FaQuoteRight } from 'react-icons/fa';
import { motion } from 'framer-motion'



function Home() {
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    setCoursesLoading(true);
    const options = { method: 'GET', url: `${import.meta.env.VITE_BACKEND_URL}/api/course/view-all` };

    axios.request(options).then(function (response) {
      console.log(response.data);
      let fetchedCourses = response.data.courses.slice(0, 8);
      let courseArray = fetchedCourses.map(course => ({
        id: course._id,
        title: course.title,
        tutor: course.tutor,
        image: course.thumbnail
      }));

      setCourses(courseArray);
    }).catch(function (error) {
      console.error(error);
      toast.error('Failed to load courses!');
    }).finally(function () {
      setCoursesLoading(false);
    });
  }, []);


  useEffect(() => {
    const options = { method: 'GET', url: `${import.meta.env.VITE_BACKEND_URL}/api/feedback/get-feedbacks` };

    axios.request(options).then(function (response) {
      console.log(response.data);
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks)
      }
    }).catch(function (error) {
      console.error(error);
    });
  }, [])


  return (
    <>
      <Hero />
      {coursesLoading ? <Loading /> : <CourseSection courses={courses} isAllPage={false} />}

      <div className="testimonials w-full flex flex-col items-center p-6 bg-gray-50">
        {feedbacks && feedbacks.length > 0 && (
          <>
            <h1 className='text-3xl font-bold mb-6'>What Our Students Say</h1>

            <Carousel className="w-full max-w-[90%] md:max-w-[700px] lg:max-w-[1000px]">
              <CarouselContent>
                {feedbacks.map(feedback => (
                  <CarouselItem key={feedback._id}>
                    <motion.div
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.8 }}


                      className="p-4 h-full">
                      <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4 h-full">
                          <FaQuoteRight className='text-5xl text-gray-500' />
                          <p className='text-base italic text-gray-700'>" {feedback.comment} "</p>
                          <img
                            src={feedback.user.picture || "/default-profile.png"}
                            alt="profile"
                            className='w-20 h-20 rounded-full border-2 border-gray-200'
                          />
                          <h2 className='text-lg font-semibold text-gray-800'>{feedback.user.name}</h2>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </>
        )}
      </div>

    </>
  )
}

export default Home