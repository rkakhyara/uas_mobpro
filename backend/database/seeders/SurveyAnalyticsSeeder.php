<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\SurveyAnalytics;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SurveyAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $surveys = Survey::with(['responses', 'questions'])->get();

        foreach ($surveys as $survey) {
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
            
            SurveyAnalytics::create([
                'survey_id' => $survey->id,
                'total_responden' => $totalResponses,
                'total_pertanyaan' => $totalQuestions,
                'total_setuju' => $totalSetuju,
                'total_tidak_setuju' => $totalTidakSetuju,
                'setuju_percentage' => round($setujuPercentage, 2),
                'tidak_setuju_percentage' => round($tidakSetujuPercentage, 2),
                'gemini_summary' => 'Survey ini menunjukkan tingkat kepuasan yang baik dari responden.',
                'gemini_insight' => 'Mayoritas responden memberikan feedback positif. Area yang perlu ditingkatkan adalah responsivitas layanan pelanggan.',
            ]);
        }
    }
}
