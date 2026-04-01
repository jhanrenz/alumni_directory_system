<?php

namespace App\Http\Controllers;
use App\Models\Event;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::where('user_id', auth()->id());
        if($request->filter === 'trashed'){
            $query->onlyTrashed();
        }else if($request->filter === 'all'){
            $query->withTrashed();
        }

        if($request->search){
            $search = $request->search;
            $query->where(function($q) use ($search){
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if($request->status){
            $query->where('status', $request->status);
        }

        $events = $query->latest()->get();
        return response()->json([
            'events' => $events
        ]);
    }

    public function publicIndex(Request $request)
    {
        $query = Event::with('user');

        if($request->search){
            $search = $request->search;
            $query->where(function($q) use ($search){
                $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "{$search}");
            });
        }
        if($request->status){
            $query->where('status', $request->status);
        }

        $events = $query->latest()->get();
        return response()->json([
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|string',
            'location' => 'required|string|max:255',
            'status' => 'nullable|in:upcoming,done',
        ]);
        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'user_id' => auth()->id(),
            'status' => $request->status
        ]);
        return response()->json([
            'message' => 'event published success',
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|string',
            'location' => 'required|string|max:255',
        ]);
        $event->update([
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'location' => $request->location,
            'user_id' => auth()->id(),
        ]);
        return response()->json([
            'message' => 'event updated success',
            'event' => $event
        ]);
    }


    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json([
            'message' => 'event deleted success'
        ]);
    }

    public function restore($event_id)
    {
        $event = Event::onlyTrashed()
        ->where('user_id', auth()->id())
        ->findOrFail($event_id);

        $event->restore();
        return response()->json([
            'message' => 'event restored success'
        ]);
    }

    public function forceDelete($event_id)
    {
        $event = Event::onlyTrashed()
        ->where('user_id', auth()->id())
        ->findOrFail($event_id);

        $event->forceDelete();
        return response()->json([
            'message' => 'event deleted permanently'
        ]);
    }

}
