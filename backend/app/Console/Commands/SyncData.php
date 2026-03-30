<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
class SyncData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
protected $signature = 'sync:data';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
 



public function handle()
{
    $data = DB::connection('mysql2')
        ->table('commandes') // 👈 table من tri_soutage
        ->select('panneau', 'tranche', 'niveau')
        ->get();

    foreach ($data as $row) {
        DB::connection('mysql')->table('poussages')->insert([
            'panneau' => $row->panneau,
            
            'tranche' => $row->tranche,
            'niveau' => $row->niveau,
           
        ]);
    }

    $this->info('Data synced successfully ✅');
}
}
