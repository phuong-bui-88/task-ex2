<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Task extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use Searchable;

    const ALL = 0;
    const REMAIN = 1;
    const OVER_DATE = 2;

    protected $fillable = ['title', 'description', 'start_date', 'end_date', 'calendar_id', 'task_id'];

    public function getDocumentsAttribute()
    {
        $documents = $this->getMedia();
        $documentOutput = [];

        foreach ($documents as $document) {
            $documentOutput []= $document->getFullUrl();
        }

        return $documentOutput;
    }

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'start_date_timestamp' => Carbon::parse($this->start_date)->timestamp,
        ];
    }
}
