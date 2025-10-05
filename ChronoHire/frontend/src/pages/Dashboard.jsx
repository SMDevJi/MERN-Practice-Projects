import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios'
import { useSelector } from 'react-redux'
import { isJwtExpired } from '@/utils/utilities';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import Loading from '@/components/Loading'
import { Switch } from "@/components/ui/switch"



function Dashboard() {
  const [open, setOpen] = useState(false)
  const [reattemptOpen, setReattemptOpen] = useState(false)
  const [error, setError] = useState(null)
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [yearsOfExperience, setYOE] = useState(0);
  const [yearsOfExperience2, setYOE2] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [difficulty2, setDifficulty2] = useState("");
  const [resume, setResume] = useState(null);
  const [resume2, setResume2] = useState(null);
  const [updateResume, setUpdateResume] = useState(false)
  const [creating, setCreating] = useState(false)
  const [creating2, setCreating2] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pastInterviews, setPastInterviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterview, setSelectedInterview] = useState(null);

  const authorization = useSelector((state) => state.user.authorization);
  const navigate = useNavigate()

  const setOpenChange = (o) => {
    setError(null)
    setOpen(o)
  }
  const setReattemptOpenChange = (o) => {
    setError(null)
    setReattemptOpen(o)
  }


  const fetchInterviews = () => {
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/interviews/get-user`,
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    };
    setLoading(true)
    axios.request(options).then(function (response) {
      console.log(response.data);
      setPastInterviews(response.data.interviews)
    }).catch(function (error) {
      console.error(error);
    }).finally(() =>
      setLoading(false)
    );
  }

  useEffect(() => {
    fetchInterviews()
  }, [])


  useEffect(() => {
    if (!authorization) {
      navigate('/login');
      return;
    }

    if (isJwtExpired(authorization)) {
      navigate('/login');
      return;
    }

  }, [authorization, navigate]);



  const handleSubmit = async () => {
    if (creating || creating2) {
      setError("Wait for request to finish first!")
      return
    }
    if (!role || !description || !yearsOfExperience || !difficulty || !resume) {
      setError("Please fill all the fields!")
      return
    }
    console.log(difficulty)

    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("description", description);
      formData.append("yearsOfExperience", yearsOfExperience);
      formData.append("difficulty", difficulty);
      formData.append("resumeFile", resume);

      setCreating(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/create`, formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${authorization}` }
      }).finally(() =>
        setCreating(false)
      );

      if (res.data.success) {
        toast.success("Interview created successfully!")
        setOpen(false)
        navigate(`/interview-details/${res.data.interviewId}`)
      } else {
        setError("Failed to generate interview!")
      }

      console.log("Interview created:", res.data);
    } catch (err) {
      console.error("Error creating interview:", err.response?.data || err.message);
    }
  };


  const handleReattempt = async (id) => {
    if (creating || creating2) {
      setError("Wait for request to finish first!")
      return
    }
    console.log(typeof yearsOfExperience2, difficulty2, resume2)
    if ((typeof yearsOfExperience2 !== 'number' || yearsOfExperience2 < 0) || !difficulty2) {
      setError("Please fill all the fields!")
      return
    }
    console.log("works...")
    //return
    try {
      console.log("first")
      const formData = new FormData();
      formData.append("yearsOfExperience", yearsOfExperience2);
      formData.append("difficulty", difficulty2);

      if (updateResume) {
        if (!resume2) {
          setError("Please upload resume!")
          return
        } else {
          formData.append("resumeFile", resume2);
        }
      }




      setCreating2(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/interviews/reattempt/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${authorization}` }
      }).finally(() =>
        setCreating2(false)
      );

      if (res.data.success) {
        toast.success("New attempt created successfully!")
        setReattemptOpen(false)
        navigate(`/interview-details/${res.data.interviewId}`)
      } else {
        setError("Failed to create reattempt!")
      }

      console.log("Reattempt created:", res.data);
    } catch (err) {
      console.error("Error creating reattempt:", err.response?.data || err.message);
    }
  }

  const filteredInterviews = pastInterviews?.filter(item =>
    item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='dash max-w-7xl mx-auto p-6'>
      <h1 className='mt-2 text-3xl font-bold text-purple-600'>Dashboard</h1>
      <p className='text-gray-500 font-medium'>Create and Start your AI Mock Interview</p>

      <Dialog open={open} onOpenChange={setOpenChange}>
        <form>
          <DialogTrigger asChild>
            <div className="cursor-pointer max-w-80 mt-3 add-btn bg-gray-200  p-10 rounded-md flex justify-center items-center    transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-gray-400">
              <p className='text-gray-800 font-medium'>+ Add New</p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className='mb-4'>
              <DialogTitle className='font-bold text-start'>Tell us more about your job interviewing</DialogTitle>
              <DialogDescription className='text-start text-gray-500 font-semibold'>
                Add details about your job position/role, Job description and years of experience
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">


              <div className="grid gap-1">
                <Label htmlFor="role" className='text-gray-500'>Job Role/Job Position</Label>
                <Input id="role" name="role" placeholder='Ex. Full Stack Developer' className='focus-visible:ring-1' onChange={(e) => setRole(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="description" className='text-gray-500'>Job Description/Tech Stack (In Short)</Label>
                <Input id="description" name="description" placeholder='Ex. React, Angular, NodeJS, MySql etc' className='focus-visible:ring-1' onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="yearsOfExperience" className='text-gray-500'>Years Of experience</Label>
                <Input id="yearsOfExperience" name="yearsOfExperience" placeholder='Ex.5' type='number' className='focus-visible:ring-1' onChange={(e) => setYOE(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="difficulty" className='mb-1 text-gray-500'>Difficulty level</Label>
                <Select id='difficulty' name='difficulty' onValueChange={(value) => setDifficulty(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>


              <div className="grid  gap-1 ">
                <Label htmlFor="resume" className='text-gray-500'>Upload Your Resume</Label>
                <Input id="resume" type="file" onChange={(e) => setResume(e.target.files[0])} accept=".docx, .pdf" />
              </div>

            </div>
            <div className="error flex justify-center">
              {error && <p className='text-red-500'>{error}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className='cursor-pointer'>Cancel</Button>
              </DialogClose>
              <Button type="submit" className={`${creating ? 'bg-purple-400 hover:bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} cursor-pointer`} onClick={handleSubmit} >
                {creating ? <FaSpinner className="animate-spin" /> : ''}
                {creating ? 'Generating Interview...' : 'Create Interview'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>

      <h1 className='text-gray-800 my-3 font-semibold text-xl'>Previous Mock Interviews</h1>
      <div className="prev-interviews ">
        {loading ?
          <div className='wrapper w-full flex justify-center px-4 '>
            <Loading className='mt-4' />
          </div>
          :
          <div className="wrapper grid md:grid-cols-3 gap-3">
            <Input type="text" className='w-full md:col-span-3 border-gray-400' placeholder="Search for an Interview"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }
              }
            />
            {
              filteredInterviews?.map((interview, idx) =>
                <div className="interview border-2 rounded-md p-4" key={idx}>
                  <h1 className='text-purple-900 text-xl font-bold'>{interview.role}</h1>
                  <p className='font-medium'>{Number(interview.yearsOfExperience)} Years of Experience</p>
                  <p className='text-gray-500'>Created At: {interview.createdAt}</p>
                  <div className="buttons grid grid-cols-2 gap-3 mt-2">
                    <Link to={`/show-evaluation/${interview.id}`} className='cursor-pointer rounded border-1 font-bold px-3 py-2 flex justify-center'>
                      <button className='cursor-pointer'>Feedback</button>
                    </Link>

                    <Button
                      className='cursor-pointer bg-purple-600 hover:bg-purple-800 rounded font-bold text-white px-3 py-2 w-full'
                      onClick={() => {
                        setSelectedInterview(interview);
                        setYOE2(interview.yearsOfExperience || 0);
                        setDifficulty2("");
                        setUpdateResume(false);
                        setResume2(null);
                        setError(null);
                        setReattemptOpen(true);
                      }}
                    >
                      Start
                    </Button>

                  </div>
                </div>
              )
            }
            <Dialog open={reattemptOpen} onOpenChange={setReattemptOpenChange}>
              <form>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader className='mb-4'>
                    <DialogTitle className='font-bold text-start'>Update interview</DialogTitle>
                    <DialogDescription className='text-start text-gray-500 font-semibold'>
                      Edit details about your job difficulty, years of experience, update resume
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <Label htmlFor="role2" className='text-gray-500'>Job Role/Job Position</Label>
                      <Input
                        id="role2"
                        name="role2"
                        value={selectedInterview?.role || ""}
                        disabled
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="description2" className='text-gray-500'>Job Description/Tech Stack</Label>
                      <Input
                        id="description2"
                        name="description2"
                        value={selectedInterview?.description || ""}
                        disabled
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="yearsOfExperience2" className='text-gray-500'>Years Of Experience</Label>
                      <Input
                        id="yearsOfExperience2"
                        name="yearsOfExperience2"
                        type="number"
                        value={yearsOfExperience2}
                        onChange={(e) => setYOE2(Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="difficulty2" className='mb-1 text-gray-500'>Difficulty level</Label>
                      <Select
                        id="difficulty2"
                        name="difficulty2"
                        value={difficulty2}
                        onValueChange={(value) => setDifficulty2(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="update" className="text-sm font-medium">Update Resume?</label>
                      <Switch id="update" checked={updateResume} onCheckedChange={setUpdateResume} />
                    </div>

                    {updateResume && (
                      <div className="grid gap-1">
                        <Label htmlFor="resume2" className='text-gray-500'>Upload Your Resume</Label>
                        <Input
                          id="resume2"
                          type="file"
                          onChange={(e) => setResume2(e.target.files[0])}
                          accept=".docx, .pdf"
                        />
                      </div>
                    )}
                  </div>

                  {error && <p className='text-red-500 text-center mt-2'>{error}</p>}

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      onClick={() => handleReattempt(selectedInterview?.id)}
                      className={`${creating2 ? 'bg-purple-400 hover:bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                    >
                      {creating2 ? <FaSpinner className="animate-spin mr-2" /> : ''}
                      {creating2 ? 'Generating Interview...' : 'Update Interview'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

          </div>

        }

      </div>
    </div>
  )
}

export default Dashboard