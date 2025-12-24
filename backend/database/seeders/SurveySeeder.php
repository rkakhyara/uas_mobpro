<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\User;
use Illuminate\Database\Seeder;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        Survey::create([
            'title' => 'Customer Satisfaction Survey',
            'description' => 'Survey untuk mengukur kepuasan pelanggan terhadap layanan kami',
            'created_by' => $admin->id,
            'is_active' => true,
        ]);

        Survey::create([
            'title' => 'Product Feedback Survey',
            'description' => 'Survey untuk mendapatkan feedback mengenai produk terbaru',
            'created_by' => $admin->id,
            'is_active' => true,
        ]);

        Survey::create([
            'title' => 'Employee Engagement Survey',
            'description' => 'Survey untuk mengukur tingkat engagement karyawan',
            'created_by' => $admin->id,
            'is_active' => false,
        ]);
    }
}
