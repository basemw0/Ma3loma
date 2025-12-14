import { useState } from "react"
import AddTopics from './AddTopics/AddTopics'
import { mockCategories } from "../../mockData/Topics";
import CommunityDetails from './CommunityDetails/CommunityDetails'
import CommunityPrivacy from './CommunityPrivacy/CommunityPrivacy'
import CommunityVisuals from "./CommunityVisuals/CommunityVisuals"
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Box } from "@mui/material"
import api from "../../src/api/axios";

export default function CreationWizard({close}){
    const [allCategories , setAllCategories] = useState(mockCategories)
    const [selectedTopics , setSelectedTopics] = useState([])
    const [privacy , setPrivacy] = useState('public')
    const [communityDetails , setCommunityDetails] = useState({name : '' , description : ''})
    const[communityVisuals , setCommunityVisuals] = useState({banner : '' ,icon : ''})
    const [step , setStep] = useState(0)
    const theme = useTheme();
    const stepsArr = [
        <AddTopics allCategories = {allCategories} setAllCategories = {setAllCategories} selectedTopics = {selectedTopics} setSelectedTopics = {setSelectedTopics}/>,
        <CommunityPrivacy privacy = {privacy} setPrivacy = {setPrivacy}/>,
        <CommunityDetails communityDetails = {communityDetails} setCommunityDetails = {setCommunityDetails} communityVisuals= {communityVisuals}/>,
        <CommunityVisuals communityVisuals= {communityVisuals} setCommunityVisuals ={setCommunityVisuals} communityDetails = {communityDetails}/>
    ]
    
    const createCommunity = async ()=>{
        console.log(selectedTopics)
        const communityObject  = {
            name : communityDetails.name,
            description: communityDetails.description,
            banner : communityVisuals.banner,
            icon : communityVisuals.icon,
            privacy : privacy,
            interests :selectedTopics
        }
        try{
        await api.post("/api/communities/create", communityObject);
        alert("Community created succesfully")
        }
        catch(e){
            alert("Error:" , e.message)
        }
    }
    const handleNext = () => {
        if (step === 3) {
            createCommunity();
            close();
            alert("Community Created!")
            
        } else {
            setStep((prev) => prev + 1);
        }
    }
    const handleBack = ()=>{
         setStep((prev)=>{
            return prev-1
        })
    }

    return(
        <Box sx={{maxWidth: 768, minHeight : 400 ,maxHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 'auto', borderRadius: 4, boxShadow: 3,backgroundColor: 'white' , padding : 2}}>
            {stepsArr[step]}
            <MobileStepper
            variant="dots"
            steps={4}
            position="static"
            activeStep={step}
            sx={{ maxWidth: 400, flexGrow: 1 }}
            nextButton={
                <Button size="small" onClick={handleNext} >
                {step == 3? "Finish" : "Next"}
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={step === 0}>
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
                Back
                </Button>
      }
    />
        </Box>

    )

}