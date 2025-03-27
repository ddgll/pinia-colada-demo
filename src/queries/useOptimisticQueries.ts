import { useQueryCache } from "@pinia/colada"
import { useToast } from "vue-toastification";

export const useOptimisticQueries = <T extends { id: string | number }>(keyFunction: (id: string | number ) => string[], options?: {
    searchKey?: string[]
}) => {
    const queryCache = useQueryCache();
    const toast = useToast();
    return {
        onMutate: (mutationData: T) => {
            const queryKey = keyFunction(mutationData.id)
            const oldEntity = queryCache.getQueryData<T>(queryKey)
            const newEntity = {
                ...(oldEntity ?? {}),
                ...mutationData
            }
            queryCache.setQueryData(queryKey, newEntity);
            queryCache.cancelQueries({ key: queryKey });
            return { oldEntity, newEntity }
        },
        onError: (err: Error, mutationData: T, context: { oldEntity?: T | undefined; newEntity?: T }): void => {
            toast.error(err.message)
            if (context?.oldEntity) {
                queryCache.setQueryData(keyFunction(mutationData.id), context.oldEntity)
            }
        },
        onSuccess: (entity: T, mutationData: T) => {
            queryCache.setQueryData(keyFunction(mutationData.id), entity)
            if (options?.searchKey) 
                queryCache.invalidateQueries({ key: options.searchKey })
        }
    }
}