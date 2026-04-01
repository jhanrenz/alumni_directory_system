<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Storage;
class UserVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('course');
        $query->where('role', '!=', 'admin');

        if($request->filter === 'trashed'){
            $query->onlyTrashed();
        }else if($request->filter === 'all'){
            $query->withTrashed();
        }
        

        if($request->filter === 'pending'){
            $query->where('verify', 'pending');
        }elseif($request->filter === 'approved'){
            $query->where('verify', 'approved');
        }else if($request->filter === 'rejected'){
            $query->where('verify', 'rejected');
        }

        if($request->search){
            $search = $request->search;
            $query->where(function($q) use ($search){
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('year', 'like', "%{$search}%");
            });
        }

        if($request->course){
            $query->where('course_id', $request->course);
        }

        $users = $query->latest()->paginate(5);
        return response()->json([
            'users' => $users
        ]);
    }

    public function verify(Request $request, User $user)
    {
        $request->validate([
            'verify' => 'required|in:pending,approved,rejected',
        ]);
        $user->update([
            'verify' => $request->verify
        ]);
        return response()->json([
            'user' => $user
        ]);
    }


    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'message' => 'user removed success'
        ]);
    }
    
    public function restore($user_id)
    {
        $user = User::onlyTrashed()
        ->findOrFail($user_id);

        $user->restore();
        return response()->json([
            'message' => 'user restored success'
        ]);
    }

    public function forceDelete(Request $request, $user_id)
    {
        $user = User::onlyTrashed()
        ->findOrFail($user_id);

        if($user->image && Storage::disk('public')->exists($user->image)){
            Storage::disk('public')->delete($user->image);
        }

        $user->forceDelete();
        return response()->json([
            'message' => 'user deleted permanently'
        ]);
    }
}
