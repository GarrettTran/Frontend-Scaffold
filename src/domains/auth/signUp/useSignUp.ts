import { COUNTRIES_LIST } from "@/shared/countries.data";
import { useState } from "react";
import { toast } from "react-toastify";
import { signUpAPI } from "./SignUpService";
import type { SignUpModel } from "./dto/SignUpModel";
import type { ExceptionDto } from "@/shared/response";

export function useListCountries(): string[] {
    const [countries] = useState<string[]>(COUNTRIES_LIST);
    return countries;
}

export function useSignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signUp = async (data: SignUpModel) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await signUpAPI(data);
            // Show success toast
            toast.success(response.data);
        } catch (err) {
            const exception = err as ExceptionDto;
            const errorMessage = exception.message || 'An error occurred during sign up';
            
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Sign up error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signUp,
        isLoading,
        error
    };
}