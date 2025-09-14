import express from "express";
import authMiddleware from '../middleware/middleware.js';
import dotenv from 'dotenv';
import Course from "../models/Course.js";
import User from "../models/User.js";
import { deleteFile } from "../utils/cloudinary.js";
import { archiveProduct, createProduct, updateProduct } from "../utils/polar.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import Progress from "../models/Progress.js";
import Feedback from "../models/Feedback.js";


dotenv.config();
const router = express.Router()


router.post('/create', authMiddleware, async (req, res) => {
    try {
        let { title, subtitle, description, category, price, whatsLearned, language, thumbnail } = req.body;

        if (!req.user.isTutor) {
            return res.status(403).json({ success: false, message: "Student can not create course." })
        }

        //creating new product in polar
        const formattedPrice = Math.round(price * 100)
        const newProduct = await createProduct(
            title,
            description,
            formattedPrice,
            req.user.id,
            req.user.name
        );


        const course = await Course.create({
            title,
            subtitle,
            tutorId: req.user.id,
            tutor: req.user.name,
            description,
            category,
            price,
            whatsLearned,
            language,
            thumbnail,
            polarProductId: newProduct.id
        })
        return res.status(200).json({ success: true, message: "Course added successfully.", details: course })
    } catch (error) {
        console.error(error);
        deleteFile(thumbnail)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



router.put('/update', authMiddleware, async (req, res) => {
    try {
        let { courseId, title, subtitle, description, category, price, whatsLearned, language, thumbnail } = req.body;

        if (!req.user.isTutor) {
            return res.status(403).json({ success: false, message: "Student can not create course." })
        }

        const oldCourse = await Course.findById(courseId)
        if (req.user.id != oldCourse.tutorId) {
            return res.status(403).json({ success: false, message: "You don't have permission to update this course." })
        }

        //updating product in polar
        const formattedPrice = Math.round(price * 100)
        if ((oldCourse.title != title) || (oldCourse.description != description) || (oldCourse.price != price)) {
            await updateProduct(oldCourse.polarProductId, {
                name: title,
                description: description,
                price: formattedPrice
            });
        }
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            title,
            subtitle,
            description,
            category,
            price,
            whatsLearned,
            language,
            thumbnail
        }, { new: true })

        const courses = await Course.find()
        if (thumbnail != oldCourse.thumbnail) {
            //console.log('\nnew thumbnail\n')
            await deleteFile(oldCourse.thumbnail)
        }

        return res.status(200).json({ success: true, message: "Course updated successfully.", updatedCourse, courses })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


router.delete('/delete', authMiddleware, async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ error: 'Course id is required.' });
    }

    try {
        let course;
        try {
            course = await Course.findById(courseId)
        } catch (error) {
            return res.status(404).json({ success: false, message: "Course not found." })
        }


        if (req.user.id != course.tutorId.toString()) {
            return res.status(403).json({ success: false, message: "You don't have permission to delete this course." });
        }

        const oldCourse = course

        await Course.findByIdAndDelete(courseId)

        //deleting course thumbnail and lectures
        await deleteFile(oldCourse.thumbnail)
        for (let each of oldCourse.lectures) {
            deleteFile(each.url)
        }


        await archiveProduct(oldCourse.polarProductId)
        const newCourses = await Course.find()

        res.status(200).json({ success: true, message: 'Course deleted successfully.', course, courses: newCourses });
    } catch (error) {
        console.error('Error deleting lecture:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});






router.post('/lectures/add', authMiddleware, async (req, res) => {
    const { courseId, title, url, isFree } = req.body;

    if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required.' });
    }

    try {
        let course;
        try {
            course = await Course.findById(courseId);
        } catch (error) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        if (req.user.id != course.tutorId) {
            return res.status(403).json({ success: false, message: "You don't have permission to update this course." })
        }
        const newLecture = {
            title,
            url,
            isFree,
            order: course.lectures.length + 1
        };

        course.lectures.push(newLecture);

        await course.save();

        res.status(200).json({ success: true, message: 'Lecture added successfully.', lecture: newLecture, lectures: course.lectures });
    } catch (err) {
        console.error('Error adding lecture:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});






router.delete('/lectures/delete', authMiddleware, async (req, res) => {
    const { lectureId } = req.body;

    if (!lectureId) {
        return res.status(400).json({ error: 'Lecture id is required.' });
    }

    try {
        let course;
        try {
            course = await Course.findOne({ 'lectures._id': lectureId });
        } catch (error) {
            return res.status(404).json({ success: false, message: 'Lecture not found.' });
        }


        if (req.user.id != course.tutorId.toString()) {
            return res.status(403).json({ success: false, message: "You don't have permission to delete this lecture." });
        }

        const lectureToDelete = course.lectures.find(
            (lecture) => lecture._id.toString() === lectureId
        );

        if (lectureToDelete?.url) {
            try {
                await deleteFile(lectureToDelete.url);
            } catch (err) {
                console.error('Failed to delete video file:', err);
            }
        }

        course.lectures = course.lectures.filter(
            (lecture) => lecture._id.toString() !== lectureId
        );


        course.lectures.forEach((lecture, index) => {
            lecture.order = index + 1;
        });

        await course.save();

        res.status(200).json({ success: true, message: 'Lecture deleted successfully.', course });
    } catch (error) {
        console.error('Error deleting lecture:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});







router.put('/lectures/update', authMiddleware, async (req, res) => {
    const { lectureId, url, title, isFree } = req.body;

    if (!lectureId) {
        return res.status(400).json({ success: false, message: 'Lecture id is required.' });
    }

    try {
        let course;
        try {
            course = await Course.findOne({ 'lectures._id': lectureId });
        } catch (error) {
            return res.status(404).json({ success: false, message: 'Lecture not found.' });
        }

        if (req.user.id !== course.tutorId.toString()) {
            return res.status(403).json({ success: false, message: "You don't have permission to update this lecture." });
        }

        let lecture;
        try {
            lecture = course.lectures.id(lectureId);
        } catch (error) {
            return res.status(404).json({ success: false, message: 'Lecture not found.' });
        }

        if (lecture.url != url) {
            await deleteFile(lecture.url);
        }


        lecture.title = title;
        lecture.isFree = isFree;
        lecture.url = url

        await course.save();

        return res.status(200).json({ success: true, message: 'Lecture updated successfully.', lecture });
    } catch (error) {
        console.error('Error updating lecture:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});










router.get('/view-all', async (req, res) => {
    try {

        const courses = await Course.find()

        const sanitizedCourses = courses.map(course => {
            if (course.lectures && Array.isArray(course.lectures)) {
                course.lectures = course.lectures.map(lecture => ({
                    ...lecture,
                    url: ""
                }));
            }
            return course;
        });

        return res.status(200).json({ success: true, message: "Course fetched successfully.", courses: sanitizedCourses })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



router.get('/get-course', async (req, res) => {
    try {
        let courseIds = req.query.courseId;

        if (!Array.isArray(courseIds)) {
            courseIds = [courseIds];
        }

        let courses;
        try {
            courses = await Course.find({ _id: { $in: courseIds } });
        } catch (error) {
            return res.status(404).json({ success: false, message: "Courses not found." });
        }


        const sanitizedCourses = courses.map(course => {
            if (course.lectures && Array.isArray(course.lectures)) {
                course.lectures = course.lectures.map(lecture => ({
                    ...lecture,
                    url: ""
                }));
            }
            return course;
        });

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            courses: sanitizedCourses
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});





router.get('/get-editable-course', authMiddleware, async (req, res) => {
    try {
        let courseId = req.query.courseId;

        let course;
        try {
            course = await Course.findById(courseId);
        } catch (error) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        if (course.tutorId != req.user.id) {
            return res.status(403).json({ success: false, message: "You don't have permission to edit this course." });
        }



        return res.status(200).json({
            success: true,
            message: "Course fetched successfully.",
            course: course
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});








router.get('/watch', authMiddleware, async (req, res) => {
    try {
        const courseId = req.query.courseId;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }


        if (!user.enrolledCourses.includes(courseId)) {
            course.lectures.forEach(lecture => {
                if (!lecture.isFree) {
                    lecture.url = '';
                }
            });
        }

        let progress = null;
        let completedLectureIds = [];


        if (user.enrolledCourses.includes(courseId)) {
            const progressDoc = await Progress.findOne({ userId: user._id });

            if (progressDoc) {
                const courseProgress = progressDoc.courses.find(
                    c => c.courseId.toString() === courseId
                );

                if (courseProgress) {
                    progress = courseProgress.progress;
                    completedLectureIds = courseProgress.completedLectureIds || [];
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully.",
            course: course,
            progress: progress,
            completedLectureIds: completedLectureIds
        });

    } catch (error) {
        console.error("Error in /watch:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});










router.put('/set-progress', authMiddleware, async (req, res) => {
    try {
        const { courseId, newProgress, completedLectureIds } = req.body;

        if (
            !courseId ||
            newProgress < 0 ||
            newProgress > 100 ||
            !Array.isArray(completedLectureIds)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input."
            });
        }

        if (req.user.isTutor) {
            return res.status(403).json({
                success: false,
                message: "Tutors cannot update course progress."
            });
        }

        let user;
        try {
            user = await User.findById(req.user.id);
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: "User not enrolled in this course."
            });
        }

        let progressDoc = await Progress.findOne({ userId: user._id });

        if (!progressDoc) {
            progressDoc = await Progress.create({
                userId: user._id,
                courses: [{
                    courseId,
                    progress: newProgress,
                    completedLectureIds
                }]
            });
        } else {
            const courseProgress = progressDoc.courses.find(
                c => c.courseId.toString() === courseId
            );

            if (courseProgress) {
                courseProgress.progress = newProgress;
                courseProgress.completedLectureIds = completedLectureIds;
            } else {
                progressDoc.courses.push({
                    courseId,
                    progress: newProgress,
                    completedLectureIds
                });
            }

            await progressDoc.save();
        }

        return res.status(200).json({
            success: true,
            message: "Progress updated successfully.",
            progress: progressDoc
        });

    } catch (error) {
        console.error("Error updating progress:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});








router.post('/feedback', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        if (req.user.isTutor) {
            return res.status(403).json({ success: false, message: "Tutors can not submit feedback." });
        }

        const feedback = await Feedback.create({
            userId: req.user.id,
            comment,
        });

        return res.status(200).json({ success: true, message: 'Feedback submitted', feedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});









router.get('/course-orders', authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        if (!req.user.isTutor) {
            return res.status(403).json({ success: false, message: "You are not a tutor." })
        }



        let orders;
        try {
            orders = await Order.find({ 'metadata.tutorId': userId })
        } catch (error) {
            return res.status(404).json({ success: false, message: "Orders not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully.",
            orders: orders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



export default router