<template>
    <div class="datatable">
        <table>
            <thead>
                <tr>
                    <th
                        v-for="field in fields"
                        :key="field.key"
                        scope="col"
                        :class="field.class"
                    >
                        {{ $t(field.label) }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, index) in tableContent"
                    :key="'row#' + index"
                >
                    <td
                        v-for="field in fields"
                        :key="field.key"
                    >
                        <slot :name="'cell(' + field.key + ')'" :row="row" :value="row[field.key]">
                            {{ row[field.key] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    name: 'DataTable',
    props: {
        fields: {
            type: Array,
            default: () => []
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {

        }
    },
    computed: {
        tableContent () {
            return this.data
        }
    }
}
</script>

<style lang="scss" scoped>
.datatable{
    @apply shadow overflow-y-hidden overflow-x-auto sm:rounded-xl;

    table{
        @apply min-w-full divide-y divide-gray-200;
        @apply dark:divide-gray-700;

        thead{
            @apply bg-gray-50;
            @apply dark:bg-gray-700;

            th{
                @apply px-2 md:px-6 py-2 text-left text-sm font-medium text-gray-400 tracking-wider whitespace-nowrap;
                @apply dark:text-gray-200;
            }
        }
        tbody{
            tr{
                @apply border-b border-gray-200;
                @apply dark:border-gray-700;
            }
            td{
                @apply px-2 md:px-6 py-2;
            }
        }
    }
}
</style>
