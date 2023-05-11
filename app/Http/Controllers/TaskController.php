<?php /** @noinspection ALL */

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Jobs\ProcessCalendarTask;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TaskRequest $request)
    {
        $tasks = [];
        $hasIndex = $request->getTaskIndex();

        $remainCount = $this->searchTasks($tasks, '>', $request->isRemainStatusActive(), $hasIndex);
        $allCount = $this->searchTasks($tasks, null, $request->isAllStatusActive(), $hasIndex);
        $overDateCount = $this->searchTasks($tasks, '<', $request->isOverDateStatusActive(), $hasIndex);

        return TaskResource::collection($tasks)
            ->additional(compact('remainCount', 'allCount', 'overDateCount'));
    }

    public function searchTasks(&$tasks, $operator, $data, $hasIndex) {
        if (!$hasIndex) {
            $query = ($operator)
                ? Task::where('start_date', $operator, now())
                : Task::whereNotNull('start_date');
        }
        else {
            $query = Task::search('', function ($meiliSearch, string $query, array $options) use ($operator) {
                ($operator)
                && $options['filter'] = sprintf('start_date_timestamp %s %s', $operator, now()->timestamp);

                return $meiliSearch->search($query, $options);
            });
        }

        ($data) && $tasks = $query->get();

        return $query->count();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTaskRequest $request)
    {
        $task = Task::create($request->all());

        ProcessCalendarTask::dispatch(
            $task, ProcessCalendarTask::CREATE
        );

        return new TaskResource($task);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
         return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTaskRequest  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(StoreTaskRequest $request, Task $task)
    {
        $task->update($request->all());

        ProcessCalendarTask::dispatchIf(isset($task->calendar_id),
        $task, ProcessCalendarTask::UPDATE);

        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        ProcessCalendarTask::dispatchIf(isset($task->calendar_id),
        null, ProcessCalendarTask::DELETE, $task->calendar_id);

        $task->delete();
        return 'ok';
    }
}
