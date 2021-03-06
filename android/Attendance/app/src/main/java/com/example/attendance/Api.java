package com.example.attendance;

import com.example.attendance.model.Result;
import com.example.attendance.model.User;


import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface Api {

    @POST("/teacher_login")
    Call<User> login(@Body User user);

    @Multipart
    @POST("/upload")
    Call<Result> upload(@Part MultipartBody.Part file,
                        @Part("dept") RequestBody dept,
                        @Part("year") RequestBody year,
                        @Part("section") RequestBody section,
                        @Part("subject") RequestBody subject,
                        @Part("email") RequestBody email);
}
