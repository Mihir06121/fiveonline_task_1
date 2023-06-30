import { useState, createRef } from "react"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { City }  from 'country-state-city';
import { Collapse } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import jsPDF from 'jspdf';

const RegistrationForm = () => {

    const [formData, setFormData] = useState({
        companyName: "Test",
        workEmailId: "test@gmail.com",
        noOfEmployees: "2",
        registeredName: "test",
        registeredLocation: "",
        avgAgeEmployee: "",
        coverageForPeople: "Employee, Spouse & Children",
        coverageForAmount: "3 Lacs",
        mobileNumber: "1234567890",
        otp: '',
        error: false,
        errorMessage: ''
    })

    const {
        companyName,
        workEmailId,
        noOfEmployees,
        registeredName,
        registeredLocation,
        avgAgeEmployee,
        coverageForPeople,
        coverageForAmount,
        mobileNumber,
        otp,
        error,
        errorMessage
    } = formData

    const [counter, setCounter] = useState(0)

    const [dummyOtp, setDummyOtp] = useState(Math.floor(1000 + Math.random() * 9000))

    const emailRegex = /\S+@\S+\.\S+/;
    const mobRegex = /^[0-9]{10}$/

    const ref = createRef()

    const handleChange = name => event => {
        setFormData({...formData, [name]: event.target.value, error: false, errorMessage: ''})
    }


    const handleNextForm = ({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber, coverageForAmount, otp}) => {
        if (companyName === ''|| workEmailId === ''|| noOfEmployees === ''|| registeredName === ''|| registeredLocation === ''|| avgAgeEmployee === ''|| coverageForPeople === ''|| coverageForAmount === '') {
            return setFormData({...formData, error: true, errorMessage: "Fields Required"})
        }
        if (!emailRegex.test(workEmailId)) {
            return setFormData({...formData, error: true, errorMessage: "Enter valid email"})
        }
        if (counter === 2 && !mobRegex.test(mobileNumber)) {
            return setFormData({...formData, error: true, errorMessage: "Enter valid Mobile Number"})
        }
        if (counter === 3 && otp !== JSON.stringify(dummyOtp)) {
            return setFormData({...formData, error: true, errorMessage: "Enter valid OTP"})
        }
        setCounter(counter + 1)
    }

    const base64Checker = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/

    const handleSubmit = ({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber}) => {
            
        const doc = new jsPDF();
        const element = document.getElementById('content')
        doc.html(element, {
            callback: function (pdf) {
                const pdfFile = pdf.output('datauristring')
                console.log(base64Checker.test(pdfFile.split(',')[1]))
                fetch(`http://localhost:8000/api/form-submit`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({pdfFile, companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber})
                }).then(res => {
                    console.log(res.json())
                }).catch(err => {
                    console.log(err.json())
                })
            }
        })
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center">
            <div className="col-8 py-5 p-3">
                <span className="fs-1">Registration Form</span>
                <Collapse in={counter === 0}>
                <div className="">
                    <div className="row py-1">
                        <div className="col-12 col-md-6 py-1">
                            <TextField
                                className="col-12"
                                id="outlined-basic" 
                                error={errorMessage === "" ? false : true}
                                label="Enter Your Company Name" 
                                variant="outlined"
                                value={companyName}
                                onChange={handleChange("companyName")} />
                        </div>
                        <div className="col-12 col-md-6 py-1">
                            <TextField 
                                className="col-12"
                                id="outlined-basic" 
                                error={errorMessage === "" ? false : true}
                                label="Enter Work Email Id" 
                                variant="outlined"
                                inputMode="email"
                                value={workEmailId}
                                onChange={handleChange("workEmailId")} />
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12 col-md-6 py-1">
                            <TextField
                                className="col-12"
                                id="outlined-basic" 
                                error={errorMessage === "" ? false : true}
                                label="Enter No. of Employees" 
                                variant="outlined"
                                inputMode="numeric"
                                value={noOfEmployees}
                                onChange={handleChange("noOfEmployees")} />
                        </div>
                        <div className="col-12 col-md-6 py-1">
                            <TextField 
                                className="col-12"
                                id="outlined-basic" 
                                error={errorMessage === "" ? false : true}
                                label="Enter Your Name" 
                                variant="outlined"
                                value={registeredName}
                                onChange={handleChange("registeredName")} />
                        </div>
                    </div>
                    <div className="row py-1">
                        <div className="col-12 col-md-6 py-1">
                            <InputLabel id="demo-simple-select-label">Enter Your Location</InputLabel>
                            <Select
                                className="col-12"
                                labelId="demo-simple-select-label"
                                error={errorMessage === "" ? false : true}
                                id="demo-simple-select"
                                value={registeredLocation}
                                onChange={handleChange('registeredLocation')}
                                >
                                    {City?.getCitiesOfCountry("IN")?.slice(0, 50)?.map((c, i) => (
                                        <MenuItem key={i} value={c.name}>{c.name}</MenuItem>
                                    ))}
                            </Select>
                        </div>
                        <div className="col-12 col-md-6 py-1">
                            <InputLabel id="demo-simple-select-label">Average Age of Employees</InputLabel>
                            <Select
                                className="col-12"
                                labelId="demo-simple-select-label"
                                error={errorMessage === "" ? false : true}
                                id="demo-simple-select"
                                value={avgAgeEmployee}
                                onChange={handleChange('avgAgeEmployee')}
                                >
                                <MenuItem value={'19-24 Years'}>19-24 Years</MenuItem>
                                <MenuItem value={'25-34 Years'}>25-34 Years</MenuItem>
                                <MenuItem value={'25-44 Years'}>25-44 Years</MenuItem>
                                <MenuItem value={'>45 Years'}>{`>45 Years`}</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="">
                        <div align="center" className="py-2 fs-4">Coverage for</div>
                        <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                defaultValue='Employee, Spouse & Children'
                                onChange={handleChange('coverageForPeople')}
                            >
                            <div className="row d-flex justify-content-between">
                                <div className="col-12 col-md-5 py-1 card m-2">
                                    <FormControlLabel value={'Employee Only'} control={<Radio />} label="Employee Only" />
                                </div>
                                <div className="col-12 col-md-5 py-1 card m-2 ">
                                    <FormControlLabel value={'Employee, Spouse & Children'} control={<Radio />} label="Employee, Spouse & Children (recommended)" />
                                </div>
                                <div className="col-12 col-md-5 py-1 card m-2">
                                    <FormControlLabel value={'Employee, Spouse, Children & Parents'} control={<Radio />} label="Employee, Spouse, Children & Parents" />
                                </div>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                {error ? <div align="center" className="card text-white fs-4 my-3 col-12 bg-danger">{errorMessage}</div> : null}
                <div className="d-flex justify-content-end align-items-center">
                    {counter === 0 ? null : 
                    <button onClick={() => setCounter(counter - 1)} className="text-white ms-3 btn btn-info rounded-0">
                        Previous
                    </button>}
                    <button onClick={() => handleNextForm({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, coverageForAmount, mobileNumber})} className="text-white ms-3 btn btn-warning rounded-0">
                        NEXT
                    </button>
                </div>
                </Collapse>
                <Collapse in={counter === 1}>
                    <div className="">
                        <div className="">
                            <div align="center" className="py-2 fs-4">Coverage for</div>
                            <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue='3 Lacs'
                                    onChange={handleChange('coverageForAmount')}
                                >
                                <div className="row d-flex justify-content-between">
                                    <div className="col-12 col-md-5 py-1 card m-2">
                                        <FormControlLabel value={'1 Lacs'} control={<Radio />} label="1 Lacs" />
                                    </div>
                                    <div className="col-12 col-md-5 py-1 card m-2 ">
                                        <FormControlLabel value={'3 Lacs'} control={<Radio />} label="3 Lacs (recommended)" />
                                    </div>
                                    <div className="col-12 col-md-5 py-1 card m-2">
                                        <FormControlLabel value={'5 Lacs'} control={<Radio />} label="5 Lacs" />
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                {error ? <div align="center" className="card text-white fs-4 my-3 col-12 bg-danger">{errorMessage}</div> : null}
                <div className="d-flex justify-content-end align-items-center">
                    {counter === 0 ? null : 
                    <button onClick={() => setCounter(counter - 1)} className="text-white ms-3 btn btn-info rounded-0">
                        Previous
                    </button>}
                    <button onClick={() => handleNextForm({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople})} className="text-white ms-3 btn btn-warning rounded-0">
                        NEXT
                    </button>
                </div>
                </Collapse>
                <Collapse in={counter === 2}>
                    <div>
                        <div className="col-12 col-md-6 py-1">
                            <TextField
                                className="col-12"
                                id="outlined-basic" 
                                error={errorMessage === "" ? false : true}
                                label="Enter Your Number" 
                                variant="outlined"
                                inputMode="numeric"
                                value={mobileNumber}
                                onChange={handleChange("mobileNumber")} />
                        </div>
                        <div className="">
                            <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <div className="col-6 px-2 card">
                                        <FormControlLabel className="" value={'Get OTP'} control={<Radio />} label="Get OTP" />
                                    </div>
                            </RadioGroup>
                        </div>
                        <div className="d-flex justify-content-start align-items-center">
                        <Checkbox />
                        <span>I Confirm That I Have Read, Understood And Agree To The Terms & Conditions. </span>
                        </div>
                    </div>
                {error ? <div align="center" className="card text-white fs-4 my-3 col-12 bg-danger">{errorMessage}</div> : null}
                <div className="d-flex justify-content-end align-items-center">
                    {counter === 0 ? null : 
                    <button onClick={() => setCounter(counter - 1)} className="text-white ms-3 btn btn-info rounded-0">
                        Previous
                    </button>}
                    <button onClick={() => handleNextForm({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber})} className="text-white ms-3 btn btn-warning rounded-0">
                        NEXT
                    </button>
                </div>
                </Collapse>
                <Collapse in={counter === 3}>
                    <div>
                            {dummyOtp}
                        <div className="col-12 col-md-6 py-1">
                            <TextField
                                className="col-12"
                                id="outlined-basic" 
                                error={errorMessage === "" ? false : true}
                                label="OTP" 
                                variant="outlined"
                                inputMode="numeric"
                                value={otp}
                                onChange={handleChange("otp")} />
                        </div>
                    </div>
                {error ? <div align="center" className="card text-white fs-4 my-3 col-12 bg-danger">{errorMessage}</div> : null}
                <div className="d-flex justify-content-end align-items-center">
                    {counter === 0 ? null : 
                    <button onClick={() => setCounter(counter - 1)} className="text-white ms-3 btn btn-info rounded-0">
                        Previous
                    </button>}
                    <button onClick={() => handleNextForm({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber, otp})} className="text-white ms-3 btn btn-warning rounded-0">
                        NEXT
                    </button>
                </div>
                </Collapse>
                <Collapse in={counter === 4}>
                    <div id="content">
                        <div className="card border-dark p-3">
                            <div align="center" className="fs-2">Registered details</div>
                            <div>
                                <div className="fs-4">Company Name: {companyName}</div>
                                <div className="fs-4">Work Email Id: {workEmailId}</div>
                                <div className="fs-4">Your Name: {registeredName}</div>
                                <div className="fs-4">No of Employees: {noOfEmployees}</div>
                                <div className="fs-4">Your Location: {registeredLocation}</div>
                                <div className="fs-4">Average Age of Employees: {avgAgeEmployee}</div>
                                <div className="fs-4">Coverage For: {coverageForPeople}, {coverageForAmount}</div>
                                <div className="fs-4">Mobile no for OTP: {mobileNumber}</div>
                            </div>
                        </div>
                    </div>
                {error ? <div align="center" className="card text-white fs-4 my-3 col-12 bg-danger">{errorMessage}</div> : null}
                <div className="d-flex justify-content-end align-items-center">
                    {counter === 0 ? null : 
                    <button onClick={() => setCounter(counter - 1)} className="text-white ms-3 btn btn-info rounded-0">
                        Previous
                    </button>}
                    {counter === 4 ? <button onClick={() => handleSubmit({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber})} className="text-white ms-3 btn btn-warning rounded-0">
                        Submit
                    </button> : 
                    <button onClick={() => handleNextForm({companyName, workEmailId, noOfEmployees, registeredName, registeredLocation, avgAgeEmployee, coverageForPeople, mobileNumber})} 
                    className="text-white ms-3 btn btn-warning rounded-0">
                        NEXT
                    </button>}
                </div>
                </Collapse>
            </div>
        </div>
    )
}

export default RegistrationForm