<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'total_responden',
        'total_pertanyaan',
        'total_setuju',
        'total_tidak_setuju',
        'setuju_percentage',
        'tidak_setuju_percentage',
        'gemini_summary',
        'gemini_insight',
        'generated_at',
    ];

    protected $casts = [
        'total_responden' => 'integer',
        'total_pertanyaan' => 'integer',
        'total_setuju' => 'integer',
        'total_tidak_setuju' => 'integer',
        'setuju_percentage' => 'decimal:2',
        'tidak_setuju_percentage' => 'decimal:2',
        'generated_at' => 'datetime',
    ];

    /**
     * Get the survey this analytics belongs to
     */
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }
}
