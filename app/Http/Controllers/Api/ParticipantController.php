<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $participants = Participant::where('user_id', Auth::id())->get();
        return response()->json($participants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:participants,email,NULL,id,user_id,' . Auth::id(), // Unique for each user_id
            // Null, id meaning is do not check itself first
        ]);

        $participant = Participant::create([
            ...$validatedData, // Spread the validated data
            'user_id' => Auth::id(), // Ensure user_id is set manually
        ]);

        return response()->json($participant, 201);
    }



    /**
     * Display the specified resource.
     */
    public function show(Participant $participant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Participant $participant)
    {
        // Validate the incoming request data.
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        // Update the participant record.
        $participant->update($data);

        // Return a JSON response (or redirect if using web routes).
        return response()->json([
            'message'     => 'Participant updated successfully.',
            'participant' => $participant,
        ]);
    }

    public function destroy(Participant $participant)
    {
        // Delete the participant record.
        $participant->delete();

        // Return a JSON response.
        return response()->json([
            'message' => 'Participant deleted successfully.',
        ]);
    }

}
