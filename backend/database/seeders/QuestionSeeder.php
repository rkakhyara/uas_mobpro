<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Survey;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $survey1 = Survey::where('title', 'Customer Satisfaction Survey')->first();
        $survey2 = Survey::where('title', 'Product Feedback Survey')->first();

        // Questions for Survey 1
        Question::create([
            'survey_id' => $survey1->id,
            'question_text' => 'Apakah Anda puas dengan layanan kami?',
            'order' => 1,
        ]);

        Question::create([
            'survey_id' => $survey1->id,
            'question_text' => 'Apakah produk kami memenuhi ekspektasi Anda?',
            'order' => 2,
        ]);

        Question::create([
            'survey_id' => $survey1->id,
            'question_text' => 'Apakah Anda akan merekomendasikan layanan kami kepada orang lain?',
            'order' => 3,
        ]);

        Question::create([
            'survey_id' => $survey1->id,
            'question_text' => 'Apakah harga yang kami tawarkan sesuai dengan kualitas?',
            'order' => 4,
        ]);

        Question::create([
            'survey_id' => $survey1->id,
            'question_text' => 'Apakah customer service kami responsif?',
            'order' => 5,
        ]);

        // Questions for Survey 2
        Question::create([
            'survey_id' => $survey2->id,
            'question_text' => 'Apakah produk baru kami mudah digunakan?',
            'order' => 1,
        ]);

        Question::create([
            'survey_id' => $survey2->id,
            'question_text' => 'Apakah fitur-fitur produk sesuai kebutuhan Anda?',
            'order' => 2,
        ]);

        Question::create([
            'survey_id' => $survey2->id,
            'question_text' => 'Apakah desain produk menarik?',
            'order' => 3,
        ]);
    }
}
