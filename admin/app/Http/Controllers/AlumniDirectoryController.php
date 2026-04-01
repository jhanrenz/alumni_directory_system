<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;
class AlumniDirectoryController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('course')
        ->where('verify', 'approved')
        ->where('role', 'user');
        if($request->search){
            $search = $request->search;
            $query->where(function ($q) use ($search){
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if($request->course){
            $query->where('course_id', $request->course);
        }

        if($request->year){
            $query->where('year', $request->year);
        }
        $users = $query->latest()->get();
        return response()->json([
            'users' => $users
        ]);
    }

public function PrintUser(Request $request)
{
    $query = User::with('course')
        ->where('verify', 'approved')
        ->where('role', 'user');

    // Filters
    $courseName = 'All Courses';
    $yearName = 'All Years';

    if($request->search){
        $search = $request->search;
        $query->where(function ($q) use ($search){
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }

    if($request->course){
        $query->where('course_id', $request->course);
        $course = \App\Models\Course::find($request->course);
        $courseName = $course ? $course->name : 'Unknown';
    }

    if($request->year){
        $query->where('year', $request->year);
        $yearName = $request->year;
    }

    // Ordering
    $users = $query
        ->join('courses', 'users.course_id', '=', 'courses.id')
        ->orderBy('courses.name', 'asc')
        ->orderBy('users.year', 'desc')
        ->orderBy('users.name', 'asc')
        ->select('users.*')
        ->get();

    $pdf = Pdf::loadView('users_pdf', compact('users', 'courseName', 'yearName'));
    return $pdf->download('alumni_directory.pdf');
}
}