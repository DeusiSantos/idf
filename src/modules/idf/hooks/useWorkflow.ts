import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toProblem } from "@/modules/idf/hooks/useProblem";
import { useToast } from "@/hooks/use-toast";

/** Executa transições de workflow, com feedback ProblemDetails uniforme. */
export const useWorkflow = (successMessage = "Processo actualizado") => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (action: () => Promise<unknown>) => action(),
    onSuccess: () => {
      toast({ title: successMessage });
      queryClient.invalidateQueries({ queryKey: ["idf"] });
    },
    onError: (error) => {
      const problem = toProblem(error);
      const firstFieldError = problem.errors ? Object.values(problem.errors)[0]?.[0] : undefined;
      toast({ variant: "destructive", title: "Acção bloqueada", description: firstFieldError ?? problem.detail });
    },
  });

  return {
    run: (action: () => Promise<unknown>) => mutation.mutate(action),
    isBusy: mutation.isPending,
  };
};
