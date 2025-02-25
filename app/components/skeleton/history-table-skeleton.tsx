
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function HistoryTableSkeleton() {
    return (
      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-400">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="text-gray-400">
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead className="text-gray-400">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="text-gray-400">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="text-gray-400">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="text-gray-400">
                <Skeleton className="h-4 w-24" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-gray-700">
                <TableCell className="font-medium">
                  <Skeleton className="h-16 w-16 rounded-sm" />
                </TableCell>
                <TableCell className="max-w-xs">
                  <Skeleton className="h-4 w-full max-w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }