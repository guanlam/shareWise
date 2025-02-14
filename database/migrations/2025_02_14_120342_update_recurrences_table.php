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
        Schema::table('recurrences', function (Blueprint $table) {
            //
            $table->dropColumn('last_generated_date'); // Remove old column
            $table->date('next_generated_date')->nullable(); // Add new column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recurrences', function (Blueprint $table) {
            //
            $table->dropColumn('next_generated_date');
            $table->date('last_generated_date')->nullable();
        });
    }
};
