<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public array $defaultStatus = [
        Task::ALL => false,
        Task::REMAIN => false,
        Task::OVER_DATE => false,
    ];

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        if ($this->has('status')) {
            $this->defaultStatus[$this->status] = true;
        }


        return [
            //
        ];
}

    public function isAllStatusActive() {
        return $this->defaultStatus[Task::ALL];
    }

    public function isRemainStatusActive() {
        return $this->defaultStatus[Task::REMAIN];
    }

    public function isOverDateStatusActive() {
        return $this->defaultStatus[Task::OVER_DATE];
    }

    public function getTaskIndex(): bool
    {
        return is_bool($this->index);
    }
}
