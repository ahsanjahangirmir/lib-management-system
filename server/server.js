import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(cors());

mongoose.connect(process.env.MONG_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
            console.log("Connected to Database");
        });
    })
    .catch((error) => {
        console.error(error);
    });

const { Schema } = mongoose;

// Book Schema
const bookSchema = new Schema({
    Title: { type: String, required: true, maxlength: 100 },
    Author: { type: String, required: true, maxlength: 100 },
    Genre: { type: String, required: true, maxlength: 15 },
    Status: { type: String, required: true, enum: ['B', 'A'], default: 'A' }, // Assuming 'B' for Borrowed, 'A' for Available
    BorrowedBy: { type: String, required: true, default: 'None'},
});

// Feedback Schema
const feedbackSchema = new Schema({
    Username: { type: String, required: true, maxlength: 20 },
    Rating: { type: Number, min: 0, max: 10, required: true},
    Comments: { type: String, required: false, maxlength: 100 },
});

// Student Schema
const studentSchema = new Schema({
    Username: { type: String, required: true, maxlength: 20 },
    Password: { type: String, required: true, maxlength: 20 },
    Number: { type: String, required: true, maxlength: 15 },
    Gender: { type: String, required: true, enum: ['M', 'F'] },
});

// Staff Schema
const staffSchema = new Schema({
    Username: { type: String, required: true, maxlength: 20 },
    Password: { type: String, required: true, maxlength: 20 },
    Number: { type: String, required: true, maxlength: 15 },
    Salary: { type: Number, required: true, min: 0 },
});

// Manager Schema
const managerSchema = new Schema({
    Username: { type: String, required: true, maxlength: 20 },
    Password: { type: String, required: true, maxlength: 20 },
    Number: { type: String, required: true, maxlength: 15 },
});

// Evaluation Schema
const evaluationSchema = new Schema({
    EvaluationID: { type: Schema.Types.ObjectId, required: true, auto: true },
    StaffID: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    ManagerID: { type: Schema.Types.ObjectId, ref: 'Manager', required: true },
    DateEvaluated: { type: Date, required: true },
    Rating: { type: Number, required: true, min: 0, max: 5 },
});

const ratingSchema = new Schema({
    Staffname: { type: String, required: true, maxlength: 100 },
    Rating: { type: Number, required: true, maxlength: 100 }
});

// Compile the models from the schemas
const Book = mongoose.model("books", bookSchema);
const Feedback = mongoose.model('feedbacks', feedbackSchema);
const Student = mongoose.model('students', studentSchema);
const Staff = mongoose.model('staffs', staffSchema);
const Manager = mongoose.model('managers', managerSchema);
const Evaluations = mongoose.model('evaluations', evaluationSchema);
const Ratings = mongoose.model('ratings', ratingSchema);

// Export the models using ES module syntax
export { Book, Feedback, Student, Staff, Manager, Evaluations };

app.listen(3100, ()=>{
    console.log("Server running at 3100")
})
//Make your API calls for every usecase here

app.post("/home", async(req, res)=>{
    const msgType = req.body.type;
    if (msgType === "std-rating-submit")
    {    
        const studentName = req.body.username
        const ratingFetched = req.body.rating
        const commentsFetched = req.body.comment
        console.log(req.body)
        const data = {
            Username: studentName,
            Rating: ratingFetched,
            Comments: commentsFetched
        };            
        try
        {                
            await Feedback.insertMany([data]);
            res.json("std-rating-submitted")            
        }  
        catch(e)
        {
            res.json("rating-not-submitted")
        }                
    }
    else if (msgType === "ratings-fetch")
    {
        try
        {
            const exists = await Feedback.find({})
            if (exists)
            {
                res.json(exists)            
            }        
            else
            {
                res.json("exists=false")
            }
        }
        catch
        {
            res.json("exists=false")
        }   
    }
    else if (msgType === "staff-ranking")
    {
        try
        {
            const exists = await Ratings.find({})
            if (exists)
            {
                const ratingSumByStaff = {};
                const ratingCountByStaff = {};

                exists.forEach((entry) => {
                const { Staffname, Rating } = entry;

                if (!ratingSumByStaff[Staffname]) {
                    ratingSumByStaff[Staffname] = 0;
                    ratingCountByStaff[Staffname] = 0;
                }

                ratingSumByStaff[Staffname] += Rating;
                ratingCountByStaff[Staffname]++;
                });

                const averageRatingByStaff = {};
                Object.keys(ratingSumByStaff).forEach((staffName) => {
                averageRatingByStaff[staffName] = ratingSumByStaff[staffName] / ratingCountByStaff[staffName];
                });

                const sortedResult = Object.entries(averageRatingByStaff)
                .sort(([, avg1], [, avg2]) => avg2 - avg1)
                .reduce((acc, [staffName, avgRating]) => {
                acc[staffName] = avgRating;
                return acc;
                }, {});   
                res.json(sortedResult)            
            }        
            else
            {
                res.json("exists=false")
            }
        }
        catch
        {
            res.json("exists=false")
        }  
    }
    else if (msgType === "delete-staff")
    {
        const userToBeDeleted = req.body.user;
        try
        {
            const result = await Staff.deleteOne({ Username: userToBeDeleted});
            if (result)
            {
                res.json("staff-deleted")            
            }        
            else
            {
                res.json("staff-exist-false")
            }
        }
        catch
        {
            res.json("exists=false")
        }   
    }
    else if (msgType === "add-staff")
    {
        const usernameFetched = req.body.username
        const passwordFetched = req.body.password
        const numberFetched = req.body.number;
        const salaryFetched = req.body.salary;
        try {
            const exists = await Staff.findOne({ Username: usernameFetched, Password: passwordFetched, Number: numberFetched, Salary: salaryFetched});
            if (exists) 
            {
                res.json("exists=true");
            } 
            else 
            {
                const data = {
                    Username: usernameFetched,
                    Password: passwordFetched,
                    Number: numberFetched,
                    Salary: salaryFetched
                };
                console.log("Creating staff...")
                await Staff.insertMany([data]);
                res.json("staff-added")
            }
        } 
        catch (error) 
        {
            console.error("Error in /signup:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else if (msgType === "add-student")
    {
        const usernameFetched = req.body.username
        const passwordFetched = req.body.password
        const numberFetched = req.body.number;
        const genderFetched = req.body.gender;
        console.log("here: ", genderFetched)
        try {
            const exists = await Student.findOne({ Username: usernameFetched, Password: passwordFetched, Number: numberFetched, Gender: genderFetched});
            if (exists) 
            {
                res.json("exists=true");
            } 
            else 
            {
                const data = {
                    Username: usernameFetched,
                    Password: passwordFetched,
                    Number: numberFetched,
                    Gender: genderFetched
                };
                console.log("Creating student...")
                await Student.insertMany([data]);
                res.json("student-added")
            }
        } 
        catch (error) 
        {
            console.error("Error in /signup:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else if (msgType === "delete-student")
    {
        const userToBeDeleted = req.body.user;
        try
        {
            const result = await Student.deleteOne({ Username: userToBeDeleted});
            if (result)
            {
                res.json("student-deleted")            
            }        
            else
            {
                res.json("student-exist-false")
            }
        }
        catch
        {
            res.json("exists=false")
        }   
    }
    else if (msgType === "add-book") {
        const { Title, Author, Genre, Status, BorrowedBy } = req.body;
        try {
            const exists = await Book.findOne({ Title: Title });
            if (exists) {
                res.json("book-exists");
            } else {
                const data = { Title, Author, Genre, Status, BorrowedBy };
                await Book.insertMany([data]);
                res.json("book-added");
            }
        } catch (error) {
            console.error("Error in adding book:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else if (msgType === "delete-book") {
        const { Title } = req.body;
        try {
            const result = await Book.deleteOne({ Title: Title });
            if (result.deletedCount > 0) {
                res.json("book-deleted");
            } else {
                res.json("book-not-found");
            }
        } catch (error) {
            console.error("Error in deleting book:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else if (msgType === "studentsearch")
    {
        const searchTerm = req.body.searchTerm;
        const category = req.body.searchBy;
        const regex = new RegExp(searchTerm, 'i');
        const query = { [category]: regex };
    
        try {
            const searchResults = await Book.find(query).exec();
            res.send(searchResults);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    else if (msgType === "return")
    {
        const { title, username, genre, author } = req.body;
        try { 
            const book = await Book.findOne({ Title: title, Status: 'B', BorrowedBy: username });
    
            if (book) {
                book.Genre = genre;
                book.Author = author;
                book.Title = title;
                book.Status = 'A';
                book.BorrowedBy = 'None';
                await book.save();
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Book is not borrowed or not found' });
            }
        } catch (error) {
            console.error("Error in /return:", error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
    else if (msgType === "borrow")
    {
        const { title, username, genre, author } = req.body;
        try {
            const book = await Book.findOne({ Title: title, Status: 'A' });
            if (book) {
                // Provide values for the required fields
                book.Genre = genre;
                book.Author = author;
                book.Title = title;
                book.Status = 'B';
                book.BorrowedBy = username;
                await book.save();
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, message: 'Book is not available or not found' });
            }
        } catch (error) {
            console.error("Error in /borrow:", error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
    else if (msgType === "generalsearch")
    {
        const searchTerm = req.body.searchTerm;
        const category = req.body.searchBy;
        console.log(searchTerm);

        const regex = new RegExp(searchTerm, 'i');

        const query = { [category]: regex };

        try {
            const searchResults = await Book.find(query).exec();
            console.log(searchResults);
            res.send(searchResults);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    else if (msgType === "staff-fetch")
    {
        try
        {
            const exists = await Staff.find({})
            if (exists)
            {
                res.json(exists)            
            }        
            else
            {
                res.json("exists=false")
            }
        }
        catch
        {
            res.json("exists=false")
        }
    }
    else if (msgType === "rating-submit")
    {
        const staffmemberFetched = req.body.staffMember
        const ratingFetched = req.body.ratingvalue
        console.log(staffmemberFetched, ratingFetched)
        const data = {
            Staffname: staffmemberFetched,
            Rating: ratingFetched,
        };            

        try
        {                
            await Ratings.insertMany([data]);
            res.json("rating-submitted")            
        }  
        catch(e)
        {
            res.json("rating-not-submitted")
        }     
    }
});


app.get("", cors(), (req, res)=>{

})

app.post("/login", async(req, res)=>{
    const usernameFetched = req.body.username
    const passwordFetched = req.body.password
    const occupationFetched = req.body.occupation
    try
    {
        if (occupationFetched === "student")
        {
            const exists = await Student.findOne({Username: usernameFetched, Password: passwordFetched})
            if (exists)
            {
                res.json("exists=true")
            }        
            else
            {
                res.json("exists=false")
            }
        }
        else if (occupationFetched === "staff")
        {
            const exists = await Staff.findOne({Username: usernameFetched, Password: passwordFetched})
            if (exists)
            {
                res.json("exists=true")
            }        
            else
            {
                res.json("exists=false")
            }
        }
        else
        {
            const exists = await Manager.findOne({Username: usernameFetched, Password: passwordFetched})
            if (exists)
            {
                res.json("exists=true")
            }        
            else
            {
                res.json("exists=false")
            }
        }        
    }
    catch
    {
        res.json("exists=false")
    }
});


app.post("/signup", async (req, res) => {
    const usernameFetched = req.body.username
    const passwordFetched = req.body.password
    const numberFetched = req.body.number;
    const occupationFetched = req.body.occupation

    if (occupationFetched === "student")
    {
        const genderFetched = req.body.gender;
        const normalizedGender = genderFetched === 'male' ? 'M' : 'F';
        const data = {
            Username: usernameFetched,
            Password: passwordFetched,
            Number: numberFetched,
            Gender: normalizedGender
        };
        try {
            const exists = await Student.findOne({ Username: usernameFetched, Password: passwordFetched, Number: numberFetched, Gender: normalizedGender});
            if (exists) 
            {
                res.json("exists=true");
            } 
            else 
            {
                console.log("Creating student...")
                await Student.insertMany([data]);
                res.json("exists=true")
            }
        } 
        catch (error) 
        {
            console.error("Error in /signup:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else if (occupationFetched === "staff")
    {
        const salaryFetched = req.body.salary;
        const data = {
            Username: usernameFetched,
            Password: passwordFetched,
            Number: numberFetched,
            Salary: salaryFetched
        };
        try {
            const exists = await Staff.findOne({ Username: usernameFetched, Password: passwordFetched, Number: numberFetched, Salary: salaryFetched});
            if (exists) 
            {
                res.json("exists=true");
            } 
            else 
            {
                console.log("Creating staff...")
                await Staff.insertMany([data]);
                res.json("exists=true")
            }
        } 
        catch (error) 
        {
            console.error("Error in /signup:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else
    {
        const data = {
            Username: usernameFetched,
            Password: passwordFetched,
            Number: numberFetched
        };
        try {
            const exists = await Manager.findOne({ Username: usernameFetched, Password: passwordFetched, Number: numberFetched});
            if (exists) 
            {
                res.json("exists=true");
            } 
            else 
            {
                console.log("Creating staff...")
                await Manager.insertMany([data]);
                res.json("exists=true")
            }
        } 
        catch (error) 
        {
            console.error("Error in /signup:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
