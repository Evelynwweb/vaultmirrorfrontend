import React , {useState,useEffect} from 'react'
import './forgotpassword.css'
import { Link,useNavigate } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Loader from '../Loader';
import Swal from 'sweetalert2'

const ForgotPassword = ({ route }) => {

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    const navigate = useNavigate()
    const [userData, setUserData] = useState()
    const [loader, setLoader] = useState(false)
    
       useEffect(() => {
      const getData = async () => {
        try {
          setLoader(true);
    
          // Check if a token exists
            const token = localStorage.getItem('token');
            console.log(token)
          if (!token) {
            navigate('/login');
            return;
          }
    
          // Fetch user data from the API
          const response = await fetch(`${route}/api/getData`, {
            headers: {
              'x-access-token': token,
              'Content-Type': 'application/json',
            },
          });
    
          // Parse the response
          const data = await response.json();
    
          // Handle errors from the API
          if (data.status === 'error') {
            localStorage.removeItem('token'); // Clear invalid token
            navigate('/login');
          } else {
            setUserData(data); // Set user data
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/login'); // Navigate to login on failure
        } finally {
          setLoader(false); // Stop loader
        }
      };
    
      getData();
       }, [navigate, route]);
    
    
    
    const sendMail = async () => {
        setLoader(true)
        const adminData = {
            service_id: 'service_n41coy6',
            template_id: 'template_pngqtzi',
            user_id: '_1vUT8k_p8wQRyQ9L',
            template_params: {
                'name': `${userData.firstname}`,
                'email': `${userData.email}`,
                'message': `https://www.user-vaultmirror.com/resetpassword`,
                'reply_to': `Info.vaultmirror@gmail.com`,
                'subject':`Password Reset`
            }
        };

        try {
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(adminData), 
            })
            setLoader(false)
            Toast.fire({
            icon: 'success',
            title: 'password reset link sent to Email!'
            })
        } catch (error) {
            setLoader(false)
            
            Toast.fire({
            icon: 'error',
            title: 'error! something went wrong'
            })
            
        }
        
    }
    
  return (
      <section className='verifyPageSection'>
          {
        loader &&
          <Loader />
      }
        <div className="verifyPageTextWrapper">
            <IoMdCheckmarkCircleOutline />
                <h1>Email verification required</h1>
            <p>click on the button below and a link to change you password would be sent to your email</p>
              <button
                  
                  onClick={() => {
                      sendMail()
                }}
            >
                send link
            </button>
        </div>
      </section>
  )
}

export default ForgotPassword