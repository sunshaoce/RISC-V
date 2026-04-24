.section .text
.globl _start

_start:
    nop

#basic labels

L1:
loop:
start:
main:
exit:

#underscore variants

_loop:
__start:
____internal:
label_1:
label_123:
a_b_c_d:

#dot notation labels (local)

.L1:
.LoopStart:
.Lmain_entry:
.Lsystem_init:
.Linternal_state_machine:

#dot inside label (edge case - valid but uncommon)

loop.start:
loop.end:
init.phase_1:
state.machine.run:
core.cpu.stage1:

#snake_case equivalents

loop_start:
loop_end:
init_phase_1:
state_machine_run:
core_cpu_pipeline_stage1:
core_cpu_pipeline_stage2:
app_v1_init_sequence:

#numeric suffix labels

label1:
label2:
label10:
label100:
version2_stage3:

#long complex labels

this_is_a_very_long_label_name:
another_extremely_long_label_used_for_testing:
recursive_parser_test_label_case:

#mixed case (case-sensitive test)

CamelCaseLabel:
Mixed_Case_Label:
UPPERCASELABEL:
lowercaselabel:

#edge but still valid (gnu/llvm accepted)

label__internal__:
.L__2:
loop__inner:

#label usage

L1:
    add x1, x2, x3
    j loop

loop:
    addi x1, x1, -1
    bnez x1, loop

.L1:
    nop

main:
    jal exit

exit:
    ret

#multiple labels back-to-back

a:
b:
c:
d:
    nop

#snake_case structure labels

state_init_phase1:
state_init_phase2:
state_run_phase_final:
engine_core_v2_start:

#nested style simulation

system_boot_sequence_start:
system_boot_sequence_check:
system_boot_sequence_finish:

#end

_end:
    li a7, 93
    li a0, 0
    ecall