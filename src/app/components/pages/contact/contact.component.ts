import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core'
import { IProfile } from '@path-interfaces/IProfile'
import { BasePageComponent } from '@path-components/base-page/base-page.component'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent extends BasePageComponent {
  profiles = input.required<IProfile>({ alias: 'profiles' })

  asIsOrder(a: any, b: any) {
    return 1
  }

  calcularIdade = function calcularIdade(nascimento: Date) {
    // Obtém a idade em milissegundos
    var idadeDifMs = Date.now() - nascimento.getTime()

    // Converte os milissegundos em data e subtrai da era linux
    var idadeData = new Date(idadeDifMs)
    var idade = idadeData.getUTCFullYear() - 1970

    return idade
  }
}
