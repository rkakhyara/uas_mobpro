<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    /**
     * Display a listing of surveys
     */
    public function index()
    {
        $surveys = Survey::with(['creator', 'questions', 'responses', 'analytics'])->get();
        return response()->json($surveys);
    }

    /**
     * Store a newly created survey
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'created_by' => 'required|exists:users,id',
            'is_active' => 'sometimes|boolean',
        ]);

        $survey = Survey::create($validated);

        return response()->json($survey, 201);
    }

    /**
     * Display the specified survey
     */
    public function show(Survey $survey)
    {
        $survey->load(['creator', 'questions', 'responses', 'analytics']);
        return response()->json($survey);
    }

    /**
     * Update the specified survey
     */
    public function update(Request $request, Survey $survey)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $survey->update($validated);

        return response()->json($survey);
    }

    /**
     * Remove the specified survey
     */
    public function destroy(Survey $survey)
    {
        $survey->delete();
        return response()->json(['message' => 'Survey deleted successfully']);
    }
}
