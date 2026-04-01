<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'course_id' => 'required|exists:courses,id',
            'year' => 'required|string',
            'image' => 'required|image|mimes:jpg,png,jpeg,svg|max:2048',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);
        $imagePath = $request->file('image')->store('user', 'public');
        $user = User::create([
            'name' => $request->name,
            'course_id' => $request->course_id,
            'year' => $request->year,
            'image' => $imagePath,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'registered success, registered pending',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if(! $user || ! Hash::check($request->password, $user->password)){
            throw ValidationException::withMessages([
                'email' => ['Invalid Credentials']
            ]);
        }

        if($user->verify === 'pending'){
            throw ValidationException::withMessages([
                'email' => ['Your account is waiting for approval of the Admin']
            ]);
        }

        if($user->role !== 'user'){
            throw ValidationException::withMessages([
                'email' => ['Unauthorized']
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json([
            'message' => 'login success',
            'user' => $user,
            'token' => $token
        ]);
    }



    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'logout success'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
