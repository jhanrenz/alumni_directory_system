<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserVerificationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AlumniDirectoryController;
use App\Http\Controllers\ContactController;

Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user',[AuthController::class,'user']);
    Route::post('/logout',[AuthController::class,'logout']); 
});


Route::post('/admin/login',[AdminAuthController::class,'adminLogin']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/admin/logout',[AdminAuthController::class,'adminLogout']);
});

Route::middleware('auth:sanctum')->group(function(){
    Route::get('users',[UserVerificationController::class,'index']);
    Route::get('/users/{id}', [UserVerificationController::class, 'show']);
    Route::patch('users/{user}',[UserVerificationController::class,'verify']);
    Route::delete('users/{user}',[UserVerificationController::class,'destroy']);
    Route::patch('users/{user}/restore',[UserVerificationController::class,'restore']);
    Route::delete('users/{user}/force',[UserVerificationController::class,'forceDelete']);
});



Route::get('/courses/public',[CourseController::class,'publicIndex']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/courses',[CourseController::class,'index']);
    Route::post('/courses',[CourseController::class,'store']);
    Route::patch('/courses/{course}',[CourseController::class,'update']);
    Route::delete('/courses/{course}',[CourseController::class,'destroy']);
    Route::patch('/courses/{course}/restore',[CourseController::class,'restore']);
    Route::delete('/courses/{course}/force',[CourseController::class,'forceDelete']);
});


Route::get('/events/public',[EventController::class,'publicIndex']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/events',[EventController::class,'index']);
    Route::post('/events',[EventController::class,'store']);
    Route::patch('/events/{event}',[EventController::class,'update']);
    Route::delete('/events/{event}',[EventController::class,'destroy']);
    Route::patch('/events/{event}/restore',[EventController::class,'restore']);
    Route::delete('/events/{event}/force',[EventController::class,'forceDelete']);
});


Route::middleware('auth:sanctum')->group(function(){
    Route::get('/alumni/users',[AlumniDirectoryController::class,'index']);
    Route::get('/alumni/users/export-pdf',[AlumniDirectoryController::class,'PrintUser']);
});


Route::middleware('auth:sanctum')->group(function(){
    Route::get('/alumni/users',[AlumniDirectoryController::class,'index']);
});


Route::get('/public/contacts/{user_id}', [ContactController::class, 'showPublic']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/contact',[ContactController::class,'index']);
    Route::post('/contact',[ContactController::class,'store']);
    Route::patch('/contact/{contact}',[ContactController::class,'update']);
    Route::delete('/contact/{contact}',[ContactController::class,'destroy']);
});