<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\Response;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $responses = Response::with('survey.questions')->get();

        foreach ($responses as $response) {
            foreach ($response->survey->questions as $question) {
                // Random answer (true/false) with 70% chance of true
                $answer = rand(1, 100) <= 70;

                Answer::create([
                    'response_id' => $response->id,
                    'question_id' => $question->id,
                    'answer' => $answer,
                ]);
            }
        }
    }
}
