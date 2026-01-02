import { useState } from "react";
import { SignInForm } from "./signIn/SignInFormUI";
import { SignUpForm } from "./signUp/SignUpFormUI";

export default function AuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);

    return (
        <div className="w-full">
            <div className="max-w-md mx-auto p-8 bg-white">
                {/* Form Component */}
                {isSignIn ? <SignInForm /> : <SignUpForm />}

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                {/* Toggle Sign In/Sign Up Link */}
                <p className="text-center mt-6 text-sm">
                    <span>
                        {isSignIn ? "New to LinkedIn?" : "Already on LinkedIn?"}{" "}
                        <a
                            href="#"
                            onClick={() => setIsSignIn(!isSignIn)}
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            {isSignIn ? "Join now" : "Sign in"}
                        </a>
                    </span>
                </p>
            </div>
        </div>
    )
}
