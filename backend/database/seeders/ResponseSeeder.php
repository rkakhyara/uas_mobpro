<?php

namespace Database\Seeders;

use App\Models\Response;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $survey1 = Survey::where('title', 'Customer Satisfaction Survey')->first();
        $survey2 = Survey::where('title', 'Product Feedback Survey')->first();
        
        $responden = User::where('role', 'responden')->take(5)->get();

        // Create responses for survey 1
        foreach ($responden as $user) {
            Response::create([
                'survey_id' => $survey1->id,
                'user_id' => $user->id,
            ]);
        }

        // Create responses for survey 2 (only first 3 users)
        foreach ($responden->take(3) as $user) {
            Response::create([
                'survey_id' => $survey2->id,
                'user_id' => $user->id,
            ]);
        }
    }
}
