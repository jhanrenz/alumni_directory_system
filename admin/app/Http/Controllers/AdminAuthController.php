<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{    
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $user = User::where('email', $request->email)->first();
        if(! $user || ! Hash::check($request->password, $user->password)){
            throw ValidationException::withMessages([
                'email' => ['Invalid Credentials']
            ]);
        }
        if($user->role !== 'admin'){
            return back()->withErrors([
                'email' => 'Unauthorized'
            ]);
        }
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function adminLogout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'logout success'
        ]);
    }
}
