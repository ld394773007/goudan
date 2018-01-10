<template>
  <div>
    <x-table full-bordered style="background-color:#fff;">
        <thead>
          <tr>
            <th>名称</th>
            <th>孩子信息</th>
            <th>班级平均</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Apple</td>
            <td>$1.25</td>
            <td> x 1</td>
          </tr>
          <tr>
            <td>Banana</td>
            <td>$1.20</td>
            <td> x 2</td>
          </tr>
        </tbody>
      </x-table>
  </div>
</template>
<script>
  import { XTable } from 'vux'
  export default {
    components: {
      XTable
    },
    data() {
      return {

      }
    }
  }
</script>
