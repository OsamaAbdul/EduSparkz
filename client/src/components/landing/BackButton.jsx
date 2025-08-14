import React from 'react'
import { Link, useNavigate } from 'react-router-dom'; 
import { Button } from "@/components/ui/button";
import {ArrowLeft } from "lucide-react"; 

const BackButton = () => {

    const navigate = useNavigate();
  return (
    <>
      <div className="absolute top-4 left-4 z-20">
              <Button
                asChild
                variant="ghost"
                className="text-white "
                onClick={() => navigate('/')}
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>
    </>
  )
}

export default BackButton
