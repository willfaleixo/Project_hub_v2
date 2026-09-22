/**
 * Pure derivative calculation for Project Health Score (PMO Standard: Worst case prevails)
 * Returns { status: 'green' | 'yellow' | 'red', label: string, reason: string, score: number, badgeClass: string }
 */
export const calculateProjectHealthScore = (project) => {
    if (!project) {
        return {
            status: 'green',
            label: 'Saudável',
            reason: 'Sem pendências críticas',
            score: 100,
            badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reasons = [];
    let redTriggers = 0;
    let yellowTriggers = 0;

    // 1. Check Red Flags
    if (project.redFlags && project.redFlags.length > 0) {
        const criticalRedFlags = project.redFlags.filter(rf => !rf.resolved && (rf.severity === 'High' || rf.severity === 'Critical' || rf.severity === 'Alto' || rf.severity === 'Crítico'));
        if (criticalRedFlags.length > 0) {
            redTriggers++;
            reasons.push(`${criticalRedFlags.length} Red Flag(s) crítico(s) aberto(s)`);
        }
    }

    // 2. Check Deadline Alert
    if (project.deadlineAlert === 'red') {
        redTriggers++;
        reasons.push('Prazo crítico de entregas comprometido');
    } else if (project.deadlineAlert === 'yellow') {
        yellowTriggers++;
        reasons.push('Alerta de atenção no cronograma');
    }

    // 3. Check Overdue Open Points (> 3 days overdue => RED, <= 3 days => YELLOW)
    if (project.openPoints && project.openPoints.length > 0) {
        let severeOpenPoints = 0;
        let mildOpenPoints = 0;

        project.openPoints.forEach(op => {
            if (op.status !== 'Concluído' && op.status !== 'Fechado' && op.dueDate) {
                const due = new Date(op.dueDate);
                due.setHours(0, 0, 0, 0);
                const diffTime = today - due;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 3) {
                    severeOpenPoints++;
                } else if (diffDays > 0) {
                    mildOpenPoints++;
                }
            }
        });

        if (severeOpenPoints > 0) {
            redTriggers++;
            reasons.push(`${severeOpenPoints} Open Point(s) vencido(s) há mais de 3 dias`);
        } else if (mildOpenPoints > 0) {
            yellowTriggers++;
            reasons.push(`${mildOpenPoints} Open Point(s) recém-vencido(s)`);
        }
    }

    // 4. Check Effort Alert & High Risks without mitigation
    if (project.effortAlert === 'yellow' || project.effortAlert === 'red') {
        yellowTriggers++;
        reasons.push('Desvio de esforço ou horas apontadas');
    }

    if (project.risks && project.risks.length > 0) {
        const unmitigatedHighRisks = project.risks.filter(r => (r.impact === 'Alto' || r.impact === 'High') && (!r.mitigation || r.mitigation.trim() === ''));
        if (unmitigatedHighRisks.length > 0) {
            yellowTriggers++;
            reasons.push(`${unmitigatedHighRisks.length} Risco(s) alto(s) sem plano de mitigação`);
        }
    }

    // Final evaluation
    if (redTriggers > 0) {
        return {
            status: 'red',
            label: 'Crítico',
            reason: reasons.join(' • ') || 'Atenção imediata requerida',
            score: 35,
            badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800 font-bold'
        };
    }

    if (yellowTriggers > 0) {
        return {
            status: 'yellow',
            label: 'Atenção',
            reason: reasons.join(' • ') || 'Pontos de atenção identificados',
            score: 70,
            badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
        };
    }

    return {
        status: 'green',
        label: 'Saudável',
        reason: 'Projeto dentro dos parâmetros operacionais previstos',
        score: 100,
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
    };
};
