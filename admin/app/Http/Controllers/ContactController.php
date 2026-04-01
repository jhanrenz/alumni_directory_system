<?php

namespace App\Http\Controllers;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where('user_id', auth()->id());
        return response()->json([
            'contacts' => $contacts
        ]);
    }

    public function showPublic($user_id)
    {
        $contact = Contact::find($user_id);

        if (!$contact) {
            return response()->json([
                'message' => 'Contact not found'
            ], 404);
        }

        return response()->json([
            'contact' => [
                'social' => $contact->social,
                'name' => $contact->name,
                'link' => $contact->link,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'social' => 'required|string|max:100',
            'name' => 'required|string|50',
            'link' => 'nullable|string|255',
        ]);
        $contact = Contact::create([
            'social' => $request->social,
            'name' => $request->name,
            'linked' => $request->link
        ]);
        return response()->json([
            'contact' => $contact
        ]);
    }

    

    public function update(Request $request,Contact $contact)
    {
        $request->validate([
            'social' => 'required|string|max:100',
            'name' => 'required|string|50',
            'link' => 'nullable|string|255',
        ]);
        $contact = Contact::create([
            'social' => $request->social,
            'name' => $request->name,
            'linked' => $request->link
        ]);
        return response()->json([
            'contact' => $contact
        ]);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json([
            'message' => 'deleted'
        ]);
    }
}
