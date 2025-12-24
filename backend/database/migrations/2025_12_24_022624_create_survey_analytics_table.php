<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('survey_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->onDelete('cascade');
            $table->integer('total_responden');
            $table->integer('total_pertanyaan');
            $table->integer('total_setuju');
            $table->integer('total_tidak_setuju');
            $table->decimal('setuju_percentage', 5, 2)->nullable();
            $table->decimal('tidak_setuju_percentage', 5, 2)->nullable();
            $table->text('gemini_summary')->nullable();
            $table->text('gemini_insight')->nullable();
            $table->timestamp('generated_at')->useCurrent();
            $table->timestamps();
            
            $table->unique('survey_id', 'unique_analytics_survey');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_analytics');
    }
};
