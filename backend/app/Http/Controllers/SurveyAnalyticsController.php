<?php

namespace App\Http\Controllers;

use App\Models\SurveyAnalytics;
use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyAnalyticsController extends Controller
{
    /**
     * Display a listing of survey analytics
     */
    public function index()
    {
        $analytics = SurveyAnalytics::with('survey')->get();
        return response()->json($analytics);
    }

    /**
     * Store a newly created analytics
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'survey_id' => 'required|exists:surveys,id',
            'total_responden' => 'required|integer|min:0',
            'total_pertanyaan' => 'required|integer|min:0',
            'total_setuju' => 'required|integer|min:0',
            'total_tidak_setuju' => 'required|integer|min:0',
            'setuju_percentage' => 'nullable|numeric|min:0|max:100',
            'tidak_setuju_percentage' => 'nullable|numeric|min:0|max:100',
            'gemini_summary' => 'nullable|string',
            'gemini_insight' => 'nullable|string',
            'generated_at' => 'sometimes|date',
        ]);

        // Check if analytics already exists for this survey
        $existing = SurveyAnalytics::where('survey_id', $validated['survey_id'])->first();

        if ($existing) {
            return response()->json([
                'message' => 'Analytics already exists for this survey'
            ], 422);
        }

        $analytics = SurveyAnalytics::create($validated);

        return response()->json($analytics, 201);
    }

    /**
     * Display the specified analytics
     */
    public function show(SurveyAnalytics $surveyAnalytics)
    {
        $surveyAnalytics->load('survey');
        return response()->json($surveyAnalytics);
    }

    /**
     * Update the specified analytics
     */
    public function update(Request $request, SurveyAnalytics $surveyAnalytics)
    {
        $validated = $request->validate([
            'total_responden' => 'sometimes|integer|min:0',
            'total_pertanyaan' => 'sometimes|integer|min:0',
            'total_setuju' => 'sometimes|integer|min:0',
            'total_tidak_setuju' => 'sometimes|integer|min:0',
            'setuju_percentage' => 'nullable|numeric|min:0|max:100',
            'tidak_setuju_percentage' => 'nullable|numeric|min:0|max:100',
            'gemini_summary' => 'nullable|string',
            'gemini_insight' => 'nullable|string',
            'generated_at' => 'sometimes|date',
        ]);

        $surveyAnalytics->update($validated);

        return response()->json($surveyAnalytics);
    }

    /**
     * Remove the specified analytics
     */
    public function destroy(SurveyAnalytics $surveyAnalytics)
    {
        $surveyAnalytics->delete();
        return response()->json(['message' => 'Analytics deleted successfully']);
    }

    /**
     * Generate analytics for a survey
     */
    public function generate(Survey $survey)
    {
        $totalResponses = $survey->responses()->count();
        $totalQuestions = $survey->questions()->count();
        
        // Count all answers
        $totalSetuju = 0;
        $totalTidakSetuju = 0;
        
        foreach ($survey->responses as $response) {
            $totalSetuju += $response->answers()->where('answer', true)->count();
            $totalTidakSetuju += $response->answers()->where('answer', false)->count();
        }
        
        $totalAnswers = $totalSetuju + $totalTidakSetuju;
        
        $setujuPercentage = $totalAnswers > 0 ? ($totalSetuju / $totalAnswers) * 100 : 0;
        $tidakSetujuPercentage = $totalAnswers > 0 ? ($totalTidakSetuju / $totalAnswers) * 100 : 0;
        
        $analytics = SurveyAnalytics::updateOrCreate(
            ['survey_id' => $survey->id],
            [
                'total_responden' => $totalResponses,
                'total_pertanyaan' => $totalQuestions,
                'total_setuju' => $totalSetuju,
                'total_tidak_setuju' => $totalTidakSetuju,
                'setuju_percentage' => round($setujuPercentage, 2),
                'tidak_setuju_percentage' => round($tidakSetujuPercentage, 2),
            ]
        );
        
        return response()->json($analytics);
    }
}
