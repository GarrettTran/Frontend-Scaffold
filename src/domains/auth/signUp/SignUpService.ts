import { apiPost } from "@/utils/https.utils";
import { API_ENDPOINTS } from "@/shared/api.config";
import type { SignUpModel } from "./dto/SignUpModel";
import type { GenericResponseDto } from "@/shared/response";

// API call - sign-up request
export async function signUpAPI(data: SignUpModel): Promise<GenericResponseDto> {
    const response = await apiPost<GenericResponseDto, SignUpModel>(
        API_ENDPOINTS.auth.signUp,
        data
    );
    
    return response;
}