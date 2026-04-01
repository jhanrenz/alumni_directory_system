<?php

namespace App\Http\Controllers;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::query()
        ->where('id', '!=', 1);
        if($request->filter === 'trashed'){
            $query->onlyTrashed();
        }else if($request->filter === 'all'){
            $query->withTrashed();
        }

        if($request->search){
            $search = $request->search;
            $query->where(function($q) use ($search){
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $courses = $query->latest()->get();
        return response()->json([
            'courses' => $courses
        ]);
    }

    public function publicIndex()
{
    $query = Course::query()
    ->where('id', '!=', 1); 
    $courses = $query->latest()->get();
    return response()->json([
        'courses' => $courses
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100'
        ]);
        $course = Course::create([
            'name' => $request->name
        ]);
        return response()->json([
            'message' => 'course added successfully',
            'course' => $course
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'name' => 'required|string|max:100'
        ]);
        $course->update([
            'name' => $request->name
        ]);
        return response()->json([
            'message' => 'course updated successfully',
            'course' => $course
        ]);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json([
            'message' => 'course removed successfully'
        ]);
    }

    public function restore($course_id)
    {
        $course = Course::onlyTrashed()
        ->findOrFail($course_id);

        $course->restore();
        return response()->json([
            'message' => 'course restored successfully'
        ]);
    }

    public function forceDelete($course_id)
    {
        $course = Course::onlyTrashed()
        ->findOrFail($course_id);

        $course->forceDelete();
        return response()->json([
            'message' => 'course deleted successfully'
        ]);
    }
}
